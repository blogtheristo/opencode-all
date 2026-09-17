// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
//
// ClaudeEngine — Anthropic Claude executor for Waza eval suites.
//
// Registers as executor name "claude" in eval.yaml:
//
//	config:
//	  executor: claude
//	  model: claude-sonnet-4-6
//
// Requires ANTHROPIC_API_KEY environment variable.
//
// This is a single-turn (non-agentic) executor: it sends the task prompt
// plus file resources to the Claude Messages API and returns the text
// response. Graders that work on text output (text, code, prompt/LLM-judge)
// all function normally. Graders that require tool-call traces
// (action_sequence, tool_constraint, skill_invocation) will see empty tool
// call lists and should be skipped when using this executor.
//
// INSTALL: copy this file into the Waza source tree:
//
//	cp claude_engine.go <waza-repo>/internal/execution/claude.go
//
// Then apply the two-line cmd_run patch (see cmd_run.patch) and rebuild:
//
//	cd <waza-repo> && go build -o waza-claude ./cmd/waza
//
// Code-Version: 1.0
// Introduced-In: DWS field note 2026-05-08-waza-usability-study
// Branch: claude/study-waza-usability-pYA3f
// Date: 2026-05-08
// Owner: Lifetime Oy / risto.paarni@lifetime.fi

package execution

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	copilot "github.com/github/copilot-sdk/go"
	"github.com/microsoft/waza/internal/models"
)

const (
	anthropicAPIURL     = "https://api.anthropic.com/v1/messages"
	anthropicAPIVersion = "2023-06-01"
	defaultClaudeModel  = "claude-sonnet-4-6"
	claudeMaxTokens     = 4096
)

// ClaudeEngine calls the Anthropic Messages API as a single-turn executor.
type ClaudeEngine struct {
	defaultModelID string
	apiKey         string
	keepWorkspace  bool

	workspacesMu sync.Mutex
	workspaces   []string

	sessionsMu sync.Mutex
	sessions   map[string]*claudeSessionRecord

	shutdownOnce sync.Once
}

type claudeSessionRecord struct {
	usage *models.UsageStats
}

// anthropicReq is the payload sent to the Anthropic Messages API.
type anthropicReq struct {
	Model     string         `json:"model"`
	MaxTokens int            `json:"max_tokens"`
	System    string         `json:"system,omitempty"`
	Messages  []anthropicMsg `json:"messages"`
}

type anthropicMsg struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type anthropicResp struct {
	ID      string `json:"id"`
	Model   string `json:"model"`
	Content []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	} `json:"content"`
	Usage struct {
		InputTokens  int `json:"input_tokens"`
		OutputTokens int `json:"output_tokens"`
	} `json:"usage"`
	StopReason string `json:"stop_reason"`
	Error      *struct {
		Type    string `json:"type"`
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

// NewClaudeEngine creates a ClaudeEngine. API key is read from ANTHROPIC_API_KEY.
func NewClaudeEngine(defaultModelID string) *ClaudeEngine {
	if defaultModelID == "" {
		defaultModelID = defaultClaudeModel
	}
	return &ClaudeEngine{
		defaultModelID: defaultModelID,
		apiKey:         os.Getenv("ANTHROPIC_API_KEY"),
		sessions:       make(map[string]*claudeSessionRecord),
	}
}

// SetKeepWorkspace implements WorkspaceKeeper.
func (e *ClaudeEngine) SetKeepWorkspace(keep bool) {
	e.keepWorkspace = keep
}

// Initialize checks that ANTHROPIC_API_KEY is set.
func (e *ClaudeEngine) Initialize(_ context.Context) error {
	if e.apiKey == "" {
		return fmt.Errorf("claude executor: ANTHROPIC_API_KEY environment variable is not set")
	}
	return nil
}

// Execute sends the task prompt to Claude and returns the text response.
func (e *ClaudeEngine) Execute(ctx context.Context, req *ExecutionRequest) (*ExecutionResponse, error) {
	start := time.Now()

	modelID := req.ModelID
	if modelID == "" {
		modelID = e.defaultModelID
	}

	// Apply per-task timeout if set.
	if req.Timeout > 0 {
		var cancel context.CancelFunc
		ctx, cancel = context.WithTimeout(ctx, req.Timeout)
		defer cancel()
	}

	// Create or reuse workspace directory.
	workspaceDir, err := e.resolveWorkspace(req)
	if err != nil {
		return nil, err
	}

	// Write resource files into the workspace.
	if err := setupWorkspaceResources(workspaceDir, req.Resources); err != nil {
		return nil, fmt.Errorf("claude executor: setting up workspace: %w", err)
	}

	// Build prompts.
	systemPrompt := e.buildSystemPrompt(req)
	userMessage := buildClaudeUserMessage(req)

	// Call Anthropic API.
	apiResp, err := e.callAPI(ctx, modelID, systemPrompt, userMessage)
	if err != nil {
		return &ExecutionResponse{
			Success:      false,
			ErrorMsg:     err.Error(),
			ModelID:      modelID,
			DurationMs:   time.Since(start).Milliseconds(),
			WorkspaceDir: workspaceDir,
			Events:       []copilot.SessionEvent{},
			ToolCalls:    []models.ToolCall{},
		}, nil
	}

	// Extract text content.
	var output strings.Builder
	for _, block := range apiResp.Content {
		if block.Type == "text" {
			output.WriteString(block.Text)
		}
	}

	// Record session for UsageStats.
	sessionID := req.SessionID
	if sessionID == "" {
		sessionID = fmt.Sprintf("claude-%d", time.Now().UnixNano())
	}
	usage := &models.UsageStats{
		Turns:        1,
		InputTokens:  apiResp.Usage.InputTokens,
		OutputTokens: apiResp.Usage.OutputTokens,
	}
	e.sessionsMu.Lock()
	e.sessions[sessionID] = &claudeSessionRecord{usage: usage}
	e.sessionsMu.Unlock()

	return &ExecutionResponse{
		FinalOutput:    output.String(),
		Events:         []copilot.SessionEvent{},
		ModelID:        modelID,
		ToolCalls:      []models.ToolCall{},
		Success:        apiResp.StopReason != "error",
		DurationMs:     time.Since(start).Milliseconds(),
		WorkspaceDir:   workspaceDir,
		WorkspaceFiles: captureWorkspaceFiles(workspaceDir),
		SessionID:      sessionID,
		Usage:          usage,
	}, nil
}

// Shutdown cleans up temporary workspaces.
func (e *ClaudeEngine) Shutdown(_ context.Context) error {
	e.shutdownOnce.Do(func() {
		e.workspacesMu.Lock()
		defer e.workspacesMu.Unlock()

		for _, dir := range e.workspaces {
			if e.keepWorkspace {
				fmt.Fprintf(os.Stderr, "Workspace preserved: %s\n", dir)
				continue
			}
			if err := os.RemoveAll(dir); err != nil {
				fmt.Fprintf(os.Stderr, "Warning: failed to remove workspace %s: %v\n", dir, err)
			}
		}
		e.workspaces = nil
	})
	return nil
}

// SessionUsage returns token usage for a completed session.
func (e *ClaudeEngine) SessionUsage(sessionID string) *models.UsageStats {
	e.sessionsMu.Lock()
	defer e.sessionsMu.Unlock()
	if s, ok := e.sessions[sessionID]; ok {
		return s.usage
	}
	return nil
}

// resolveWorkspace returns req.WorkspaceDir if set, otherwise creates a new tmpdir.
func (e *ClaudeEngine) resolveWorkspace(req *ExecutionRequest) (string, error) {
	if req.WorkspaceDir != "" {
		return req.WorkspaceDir, nil
	}
	dir, err := os.MkdirTemp("", "waza-claude-*")
	if err != nil {
		return "", fmt.Errorf("claude executor: creating workspace: %w", err)
	}
	e.workspacesMu.Lock()
	e.workspaces = append(e.workspaces, dir)
	e.workspacesMu.Unlock()
	return dir, nil
}

// buildSystemPrompt constructs a system prompt by injecting SKILL.md content
// from each directory in req.SkillPaths.
func (e *ClaudeEngine) buildSystemPrompt(req *ExecutionRequest) string {
	if req.NoSkills || len(req.SkillPaths) == 0 {
		return ""
	}
	var parts []string
	for _, dir := range req.SkillPaths {
		skillFile := filepath.Join(dir, "SKILL.md")
		data, err := os.ReadFile(skillFile)
		if err != nil {
			continue
		}
		parts = append(parts, strings.TrimSpace(string(data)))
	}
	if len(parts) == 0 {
		return ""
	}
	return "Follow the skill instructions below when responding.\n\n" +
		strings.Join(parts, "\n\n---\n\n")
}

// buildClaudeUserMessage builds the full user message from the request.
func buildClaudeUserMessage(req *ExecutionRequest) string {
	var b strings.Builder
	b.WriteString(req.Message)

	if len(req.Context) > 0 {
		b.WriteString("\n\nContext:\n")
		for k, v := range req.Context {
			fmt.Fprintf(&b, "  %s: %v\n", k, v)
		}
	}

	if len(req.Resources) > 0 {
		fmt.Fprintf(&b, "\n\n%d file(s) provided:\n", len(req.Resources))
		for _, r := range req.Resources {
			fmt.Fprintf(&b, "\n--- %s ---\n%s\n", r.Path, string(r.Content))
		}
	}

	return b.String()
}

// callAPI sends a request to the Anthropic Messages API and returns the parsed response.
func (e *ClaudeEngine) callAPI(ctx context.Context, model, system, userMsg string) (*anthropicResp, error) {
	payload := anthropicReq{
		Model:     model,
		MaxTokens: claudeMaxTokens,
		Messages:  []anthropicMsg{{Role: "user", Content: userMsg}},
	}
	if system != "" {
		payload.System = system
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("marshaling API request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicAPIURL, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("creating HTTP request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-api-key", e.apiKey)
	httpReq.Header.Set("anthropic-version", anthropicAPIVersion)

	httpResp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("calling Anthropic API: %w", err)
	}
	defer httpResp.Body.Close()

	var result anthropicResp
	if err := json.NewDecoder(httpResp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("decoding API response (status %d): %w", httpResp.StatusCode, err)
	}

	if httpResp.StatusCode != http.StatusOK {
		errMsg := "unknown error"
		if result.Error != nil {
			errMsg = result.Error.Message
		}
		return nil, fmt.Errorf("Anthropic API %d: %s", httpResp.StatusCode, errMsg)
	}

	return &result, nil
}
