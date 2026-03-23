# Phase 05: Grounding and Memory Systems
## DWS IQ 6 Agent Architecture

**Phase:** 05 of 10  
**Status:** Memory Design  
**Dependencies:** Phase 03, Phase 04  
**Output:** Memory schemas, RAG pipeline, Supabase configuration

---

## 5.1 Memory Architecture Overview

Memory enables agent continuity, personalization, and grounded responses. DWS IQ 6 implements four memory types:

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SESSION MEMORY (Short-term)                                    │
│  ├── Current conversation context                               │
│  ├── In-flight task state                                      │
│  └── Stored: LangGraph checkpoints                             │
│  TTL: Session duration                                         │
│                                                                 │
│  SEMANTIC MEMORY (Long-term knowledge)                         │
│  ├── Customer-specific knowledge                               │
│  ├── Domain expertise                                          │
│  └── Stored: Supabase pgVector                                 │
│  TTL: Indefinite (with periodic refresh)                       │
│                                                                 │
│  EPISODIC MEMORY (Event history)                               │
│  ├── Past interactions                                         │
│  ├── Task completions                                          │
│  └── Stored: Supabase PostgreSQL                               │
│  TTL: 7 years (compliance requirement)                         │
│                                                                 │
│  PROCEDURAL MEMORY (Learned patterns)                          │
│  ├── Successful task templates                                 │
│  ├── Error recovery patterns                                   │
│  └── Stored: Supabase + model fine-tuning                      │
│  TTL: Indefinite                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5.2 Supabase Database Schema

### Core Tables

```sql
-- memory/schema.sql
-- DWS IQ 6 Memory System Database Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- For text search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOMER CONTEXT TABLES
-- ============================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(500) NOT NULL,
    business_id VARCHAR(20),  -- Finnish Y-tunnus
    industry VARCHAR(50) NOT NULL,
    tier VARCHAR(20) DEFAULT 'starter',
    certifications TEXT[],
    regulatory_requirements TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_customers_industry ON customers(industry);

-- ============================================
-- SEMANTIC MEMORY (Vector Storage)
-- ============================================

CREATE TABLE semantic_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    memory_type VARCHAR(50) NOT NULL,  -- 'preference', 'knowledge', 'procedure'
    content TEXT NOT NULL,
    embedding VECTOR(1536),  -- OpenAI text-embedding-3-small dimensions
    metadata JSONB DEFAULT '{}',
    source VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    confidence FLOAT DEFAULT 1.0
);

-- Vector similarity index (HNSW for fast retrieval)
CREATE INDEX idx_semantic_embedding ON semantic_memories 
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_semantic_customer ON semantic_memories(customer_id);
CREATE INDEX idx_semantic_type ON semantic_memories(memory_type);

-- ============================================
-- EPISODIC MEMORY (Interaction History)
-- ============================================

CREATE TABLE episodic_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    conversation_id VARCHAR(255) NOT NULL,
    agent_type VARCHAR(50) NOT NULL,
    user_message TEXT NOT NULL,
    agent_response TEXT NOT NULL,
    tools_used TEXT[],
    task_completed BOOLEAN DEFAULT FALSE,
    satisfaction_score FLOAT,
    embedding VECTOR(1536),  -- For similar episode retrieval
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_episodic_customer ON episodic_memories(customer_id);
CREATE INDEX idx_episodic_conversation ON episodic_memories(conversation_id);
CREATE INDEX idx_episodic_created ON episodic_memories(created_at DESC);
CREATE INDEX idx_episodic_embedding ON episodic_memories 
    USING hnsw (embedding vector_cosine_ops);

-- ============================================
-- PROCEDURAL MEMORY (Task Templates)
-- ============================================

CREATE TABLE procedural_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_type VARCHAR(100) NOT NULL,
    industry VARCHAR(50),
    success_pattern JSONB NOT NULL,  -- Tool sequence, parameters
    failure_pattern JSONB,  -- What to avoid
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    avg_completion_time_ms INTEGER,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_procedural_task ON procedural_memories(task_type);
CREATE INDEX idx_procedural_industry ON procedural_memories(industry);

-- ============================================
-- COMPLIANCE KNOWLEDGE BASE
-- ============================================

CREATE TABLE regulation_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    regulation_name VARCHAR(100) NOT NULL,  -- 'GDPR', 'NIS2', etc.
    regulation_full_name VARCHAR(500),
    jurisdiction VARCHAR(10) NOT NULL,  -- 'EU', 'FI', 'SE'
    article_number VARCHAR(20),
    section_title VARCHAR(500),
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    source_url TEXT,
    effective_date DATE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_regulations_name ON regulation_documents(regulation_name);
CREATE INDEX idx_regulations_jurisdiction ON regulation_documents(jurisdiction);
CREATE INDEX idx_regulations_embedding ON regulation_documents 
    USING hnsw (embedding vector_cosine_ops);

-- ============================================
-- AUDIT LOG (7-year retention)
-- ============================================

CREATE TABLE memory_audit_log (
    id BIGSERIAL PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    operation VARCHAR(20) NOT NULL,  -- 'read', 'write', 'delete'
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_value JSONB,
    new_value JSONB,
    user_agent VARCHAR(255),
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by month for efficient retention management
CREATE INDEX idx_audit_customer ON memory_audit_log(customer_id);
CREATE INDEX idx_audit_created ON memory_audit_log(created_at);

-- ============================================
-- FUNCTIONS FOR VECTOR SEARCH
-- ============================================

-- Semantic memory search
CREATE OR REPLACE FUNCTION match_semantic_memories(
    query_embedding VECTOR(1536),
    customer_filter UUID DEFAULT NULL,
    memory_type_filter VARCHAR(50) DEFAULT NULL,
    match_count INT DEFAULT 5,
    similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    customer_id UUID,
    memory_type VARCHAR(50),
    content TEXT,
    similarity FLOAT,
    metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.id,
        sm.customer_id,
        sm.memory_type,
        sm.content,
        1 - (sm.embedding <=> query_embedding) AS similarity,
        sm.metadata
    FROM semantic_memories sm
    WHERE 
        (customer_filter IS NULL OR sm.customer_id = customer_filter)
        AND (memory_type_filter IS NULL OR sm.memory_type = memory_type_filter)
        AND 1 - (sm.embedding <=> query_embedding) > similarity_threshold
    ORDER BY sm.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Similar episode retrieval
CREATE OR REPLACE FUNCTION find_similar_episodes(
    query_embedding VECTOR(1536),
    customer_filter UUID DEFAULT NULL,
    match_count INT DEFAULT 3
)
RETURNS TABLE (
    id UUID,
    conversation_id VARCHAR(255),
    user_message TEXT,
    agent_response TEXT,
    tools_used TEXT[],
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        em.id,
        em.conversation_id,
        em.user_message,
        em.agent_response,
        em.tools_used,
        1 - (em.embedding <=> query_embedding) AS similarity
    FROM episodic_memories em
    WHERE 
        (customer_filter IS NULL OR em.customer_id = customer_filter)
        AND em.task_completed = TRUE
    ORDER BY em.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Regulation search
CREATE OR REPLACE FUNCTION match_regulations(
    query_embedding VECTOR(1536),
    regulation_filter TEXT[] DEFAULT NULL,
    jurisdiction_filter VARCHAR(10) DEFAULT NULL,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    regulation_name VARCHAR(100),
    article_number VARCHAR(20),
    section_title VARCHAR(500),
    content TEXT,
    similarity FLOAT,
    source_url TEXT,
    last_updated TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rd.id,
        rd.regulation_name,
        rd.article_number,
        rd.section_title,
        rd.content,
        1 - (rd.embedding <=> query_embedding) AS similarity,
        rd.source_url,
        rd.last_updated
    FROM regulation_documents rd
    WHERE 
        (regulation_filter IS NULL OR rd.regulation_name = ANY(regulation_filter))
        AND (jurisdiction_filter IS NULL OR rd.jurisdiction = jurisdiction_filter)
    ORDER BY rd.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================
-- ROW LEVEL SECURITY (GDPR Compliance)
-- ============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodic_memories ENABLE ROW LEVEL SECURITY;

-- Customers can only access their own data
CREATE POLICY customer_isolation ON customers
    FOR ALL
    USING (id = current_setting('app.current_customer_id')::UUID);

CREATE POLICY semantic_customer_isolation ON semantic_memories
    FOR ALL
    USING (customer_id = current_setting('app.current_customer_id')::UUID);

CREATE POLICY episodic_customer_isolation ON episodic_memories
    FOR ALL
    USING (customer_id = current_setting('app.current_customer_id')::UUID);

-- Service role bypasses RLS for system operations
CREATE POLICY service_role_full_access ON customers
    FOR ALL
    TO service_role
    USING (TRUE);
```

---

## 5.3 Memory Management Service

### Python Implementation

```python
"""
memory/memory_manager.py
Memory management service for DWS IQ 6 agents
"""
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from datetime import datetime
import httpx
import os
from supabase import create_client, Client

@dataclass
class MemoryItem:
    """Represents a memory item."""
    id: str
    content: str
    memory_type: str
    similarity: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None

class MemoryManager:
    """
    Manages all memory operations for DWS IQ 6 agents.
    Integrates with Supabase for persistence and vector search.
    """
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get("SUPABASE_URL"),
            os.environ.get("SUPABASE_SERVICE_KEY")
        )
        self.embedding_api_key = os.environ.get("OPENAI_API_KEY")
        self.embedding_model = "text-embedding-3-small"
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using OpenAI."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/embeddings",
                json={
                    "input": text,
                    "model": self.embedding_model
                },
                headers={"Authorization": f"Bearer {self.embedding_api_key}"}
            )
            return response.json()["data"][0]["embedding"]
    
    # ==========================================
    # SEMANTIC MEMORY OPERATIONS
    # ==========================================
    
    async def store_semantic_memory(
        self,
        customer_id: str,
        content: str,
        memory_type: str,
        source: Optional[str] = None,
        metadata: Optional[Dict] = None
    ) -> str:
        """Store a new semantic memory with embedding."""
        
        # Generate embedding
        embedding = await self.generate_embedding(content)
        
        # Insert into Supabase
        result = self.supabase.table("semantic_memories").insert({
            "customer_id": customer_id,
            "content": content,
            "memory_type": memory_type,
            "embedding": embedding,
            "source": source,
            "metadata": metadata or {}
        }).execute()
        
        return result.data[0]["id"]
    
    async def recall_semantic_memories(
        self,
        query: str,
        customer_id: Optional[str] = None,
        memory_type: Optional[str] = None,
        max_results: int = 5,
        similarity_threshold: float = 0.7
    ) -> List[MemoryItem]:
        """Retrieve relevant semantic memories using vector similarity."""
        
        # Generate query embedding
        query_embedding = await self.generate_embedding(query)
        
        # Call Supabase function
        result = self.supabase.rpc("match_semantic_memories", {
            "query_embedding": query_embedding,
            "customer_filter": customer_id,
            "memory_type_filter": memory_type,
            "match_count": max_results,
            "similarity_threshold": similarity_threshold
        }).execute()
        
        # Update access timestamps
        for item in result.data:
            self.supabase.table("semantic_memories").update({
                "accessed_at": datetime.utcnow().isoformat(),
                "access_count": item.get("access_count", 0) + 1
            }).eq("id", item["id"]).execute()
        
        return [
            MemoryItem(
                id=item["id"],
                content=item["content"],
                memory_type=item["memory_type"],
                similarity=item["similarity"],
                metadata=item["metadata"]
            )
            for item in result.data
        ]
    
    # ==========================================
    # EPISODIC MEMORY OPERATIONS
    # ==========================================
    
    async def store_episode(
        self,
        customer_id: str,
        conversation_id: str,
        agent_type: str,
        user_message: str,
        agent_response: str,
        tools_used: Optional[List[str]] = None,
        task_completed: bool = False,
        metadata: Optional[Dict] = None
    ) -> str:
        """Store an interaction episode."""
        
        # Generate embedding for the full exchange
        exchange_text = f"User: {user_message}\nAgent: {agent_response}"
        embedding = await self.generate_embedding(exchange_text)
        
        result = self.supabase.table("episodic_memories").insert({
            "customer_id": customer_id,
            "conversation_id": conversation_id,
            "agent_type": agent_type,
            "user_message": user_message,
            "agent_response": agent_response,
            "tools_used": tools_used or [],
            "task_completed": task_completed,
            "embedding": embedding,
            "metadata": metadata or {}
        }).execute()
        
        return result.data[0]["id"]
    
    async def recall_similar_episodes(
        self,
        query: str,
        customer_id: Optional[str] = None,
        max_results: int = 3
    ) -> List[Dict]:
        """Find similar past episodes for few-shot learning."""
        
        query_embedding = await self.generate_embedding(query)
        
        result = self.supabase.rpc("find_similar_episodes", {
            "query_embedding": query_embedding,
            "customer_filter": customer_id,
            "match_count": max_results
        }).execute()
        
        return result.data
    
    async def get_recent_episodes(
        self,
        customer_id: str,
        limit: int = 10
    ) -> List[Dict]:
        """Get recent episodes for context."""
        
        result = self.supabase.table("episodic_memories") \
            .select("*") \
            .eq("customer_id", customer_id) \
            .order("created_at", desc=True) \
            .limit(limit) \
            .execute()
        
        return result.data
    
    # ==========================================
    # PROCEDURAL MEMORY OPERATIONS
    # ==========================================
    
    async def learn_procedure(
        self,
        task_type: str,
        success_pattern: Dict,
        industry: Optional[str] = None,
        completion_time_ms: Optional[int] = None
    ) -> str:
        """Learn from a successful task completion."""
        
        # Check if pattern exists
        existing = self.supabase.table("procedural_memories") \
            .select("*") \
            .eq("task_type", task_type) \
            .eq("industry", industry) \
            .execute()
        
        if existing.data:
            # Update existing pattern
            record = existing.data[0]
            new_success_count = record["success_count"] + 1
            
            # Update average completion time
            if completion_time_ms:
                old_avg = record.get("avg_completion_time_ms", completion_time_ms)
                new_avg = int((old_avg * record["success_count"] + completion_time_ms) / new_success_count)
            else:
                new_avg = record.get("avg_completion_time_ms")
            
            self.supabase.table("procedural_memories").update({
                "success_count": new_success_count,
                "avg_completion_time_ms": new_avg,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", record["id"]).execute()
            
            return record["id"]
        else:
            # Create new pattern
            pattern_text = f"Task: {task_type}, Pattern: {str(success_pattern)}"
            embedding = await self.generate_embedding(pattern_text)
            
            result = self.supabase.table("procedural_memories").insert({
                "task_type": task_type,
                "industry": industry,
                "success_pattern": success_pattern,
                "success_count": 1,
                "avg_completion_time_ms": completion_time_ms,
                "embedding": embedding
            }).execute()
            
            return result.data[0]["id"]
    
    async def get_best_procedure(
        self,
        task_type: str,
        industry: Optional[str] = None
    ) -> Optional[Dict]:
        """Get the best known procedure for a task type."""
        
        query = self.supabase.table("procedural_memories") \
            .select("*") \
            .eq("task_type", task_type)
        
        if industry:
            query = query.eq("industry", industry)
        
        result = query.order("success_count", desc=True).limit(1).execute()
        
        if result.data:
            return result.data[0]["success_pattern"]
        return None
    
    # ==========================================
    # GROUNDING: REGULATION RETRIEVAL
    # ==========================================
    
    async def search_regulations(
        self,
        query: str,
        regulation_types: Optional[List[str]] = None,
        jurisdiction: Optional[str] = None,
        max_results: int = 5
    ) -> List[Dict]:
        """Search regulatory documents for grounding."""
        
        query_embedding = await self.generate_embedding(query)
        
        result = self.supabase.rpc("match_regulations", {
            "query_embedding": query_embedding,
            "regulation_filter": regulation_types,
            "jurisdiction_filter": jurisdiction,
            "match_count": max_results
        }).execute()
        
        return result.data
    
    # ==========================================
    # GDPR COMPLIANCE: DATA DELETION
    # ==========================================
    
    async def delete_customer_data(
        self,
        customer_id: str,
        requester_id: str
    ) -> Dict:
        """
        GDPR Right to Erasure implementation.
        Deletes all customer data across memory tables.
        """
        
        deleted_counts = {}
        
        # Delete semantic memories
        result = self.supabase.table("semantic_memories") \
            .delete() \
            .eq("customer_id", customer_id) \
            .execute()
        deleted_counts["semantic_memories"] = len(result.data)
        
        # Delete episodic memories
        result = self.supabase.table("episodic_memories") \
            .delete() \
            .eq("customer_id", customer_id) \
            .execute()
        deleted_counts["episodic_memories"] = len(result.data)
        
        # Delete customer record
        result = self.supabase.table("customers") \
            .delete() \
            .eq("id", customer_id) \
            .execute()
        deleted_counts["customer_record"] = 1 if result.data else 0
        
        # Log deletion for compliance
        self.supabase.table("memory_audit_log").insert({
            "customer_id": customer_id,
            "operation": "delete",
            "table_name": "all_customer_data",
            "old_value": deleted_counts,
            "user_agent": f"GDPR erasure request by {requester_id}"
        }).execute()
        
        return {
            "status": "completed",
            "customer_id": customer_id,
            "deleted_records": deleted_counts,
            "timestamp": datetime.utcnow().isoformat()
        }
```

---

## 5.4 RAG Pipeline Configuration

### Document Ingestion Pipeline

```python
"""
memory/rag_pipeline.py
Document ingestion and chunking for RAG
"""
from typing import List, Dict
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
import hashlib

class RAGPipeline:
    """
    Document processing pipeline for the compliance knowledge base.
    """
    
    def __init__(self, memory_manager: MemoryManager):
        self.memory = memory_manager
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    async def ingest_regulation(
        self,
        file_path: str,
        regulation_name: str,
        jurisdiction: str,
        source_url: Optional[str] = None
    ) -> Dict:
        """
        Ingest a regulatory document into the knowledge base.
        """
        
        # Load document
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        else:
            loader = TextLoader(file_path)
        
        documents = loader.load()
        
        # Split into chunks
        chunks = self.splitter.split_documents(documents)
        
        # Process each chunk
        ingested = 0
        skipped = 0
        
        for i, chunk in enumerate(chunks):
            # Generate content hash for deduplication
            content_hash = hashlib.sha256(chunk.page_content.encode()).hexdigest()
            
            # Check if already exists
            existing = self.memory.supabase.table("regulation_documents") \
                .select("id") \
                .eq("regulation_name", regulation_name) \
                .contains("metadata", {"content_hash": content_hash}) \
                .execute()
            
            if existing.data:
                skipped += 1
                continue
            
            # Generate embedding
            embedding = await self.memory.generate_embedding(chunk.page_content)
            
            # Extract article number if present
            article_number = self._extract_article_number(chunk.page_content)
            
            # Insert
            self.memory.supabase.table("regulation_documents").insert({
                "regulation_name": regulation_name,
                "jurisdiction": jurisdiction,
                "article_number": article_number,
                "section_title": chunk.metadata.get("section", f"Chunk {i+1}"),
                "content": chunk.page_content,
                "embedding": embedding,
                "source_url": source_url,
                "metadata": {
                    "content_hash": content_hash,
                    "page": chunk.metadata.get("page"),
                    "chunk_index": i
                }
            }).execute()
            
            ingested += 1
        
        return {
            "regulation": regulation_name,
            "total_chunks": len(chunks),
            "ingested": ingested,
            "skipped_duplicates": skipped
        }
    
    def _extract_article_number(self, text: str) -> Optional[str]:
        """Extract article number from regulation text."""
        import re
        
        patterns = [
            r"Article\s+(\d+(?:\.\d+)?)",
            r"Art\.\s+(\d+(?:\.\d+)?)",
            r"Section\s+(\d+(?:\.\d+)?)"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return None

# Example usage for initial population
async def populate_compliance_kb():
    """Populate the compliance knowledge base with core regulations."""
    
    memory = MemoryManager()
    pipeline = RAGPipeline(memory)
    
    regulations = [
        {
            "file": "data/regulations/gdpr_full.pdf",
            "name": "GDPR",
            "jurisdiction": "EU",
            "url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj"
        },
        {
            "file": "data/regulations/nis2_directive.pdf",
            "name": "NIS2",
            "jurisdiction": "EU",
            "url": "https://eur-lex.europa.eu/eli/dir/2022/2555/oj"
        },
        {
            "file": "data/regulations/tietosuojalaki.pdf",
            "name": "Tietosuojalaki",
            "jurisdiction": "FI",
            "url": "https://www.finlex.fi/fi/laki/alkup/2018/20181050"
        }
    ]
    
    for reg in regulations:
        result = await pipeline.ingest_regulation(
            file_path=reg["file"],
            regulation_name=reg["name"],
            jurisdiction=reg["jurisdiction"],
            source_url=reg["url"]
        )
        print(f"Ingested {reg['name']}: {result}")
```

---

## 5.5 Memory Integration with Agents

### Context Assembly for Agent Prompts

```python
"""
memory/context_builder.py
Build rich context for agent prompts using memory
"""
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class AgentContext:
    """Assembled context for agent invocation."""
    customer_info: Dict
    semantic_memories: List[Dict]
    recent_episodes: List[Dict]
    similar_episodes: List[Dict]
    relevant_regulations: List[Dict]
    procedural_hints: Optional[Dict]

class ContextBuilder:
    """
    Assembles comprehensive context for agent prompts
    by querying all memory systems.
    """
    
    def __init__(self, memory_manager: MemoryManager):
        self.memory = memory_manager
    
    async def build_context(
        self,
        customer_id: str,
        user_query: str,
        agent_type: str,
        max_memories: int = 5
    ) -> AgentContext:
        """
        Build complete context for an agent invocation.
        """
        
        # Get customer info
        customer = await self._get_customer(customer_id)
        
        # Recall relevant semantic memories
        semantic = await self.memory.recall_semantic_memories(
            query=user_query,
            customer_id=customer_id,
            max_results=max_memories
        )
        
        # Get recent interaction history
        recent = await self.memory.get_recent_episodes(
            customer_id=customer_id,
            limit=5
        )
        
        # Find similar past episodes for few-shot examples
        similar = await self.memory.recall_similar_episodes(
            query=user_query,
            customer_id=customer_id,
            max_results=3
        )
        
        # Get relevant regulations based on query and customer industry
        regulations = await self.memory.search_regulations(
            query=user_query,
            jurisdiction=customer.get("regulatory_requirements", ["EU"])[0] if customer else "EU",
            max_results=3
        )
        
        # Get best known procedure for this task type
        task_type = self._infer_task_type(user_query, agent_type)
        procedure = await self.memory.get_best_procedure(
            task_type=task_type,
            industry=customer.get("industry") if customer else None
        )
        
        return AgentContext(
            customer_info=customer,
            semantic_memories=[m.__dict__ for m in semantic],
            recent_episodes=recent,
            similar_episodes=similar,
            relevant_regulations=regulations,
            procedural_hints=procedure
        )
    
    async def _get_customer(self, customer_id: str) -> Optional[Dict]:
        """Retrieve customer information."""
        result = self.memory.supabase.table("customers") \
            .select("*") \
            .eq("id", customer_id) \
            .single() \
            .execute()
        return result.data
    
    def _infer_task_type(self, query: str, agent_type: str) -> str:
        """Infer task type from query for procedural memory lookup."""
        
        task_keywords = {
            "route": "route_optimization",
            "driver": "driver_dispatch",
            "permit": "permit_check",
            "compliance": "compliance_verification",
            "subcontractor": "subcontractor_vetting",
            "invoice": "invoice_generation",
            "schedule": "scheduling"
        }
        
        query_lower = query.lower()
        
        for keyword, task_type in task_keywords.items():
            if keyword in query_lower:
                return f"{agent_type}_{task_type}"
        
        return f"{agent_type}_general"
    
    def format_for_prompt(self, context: AgentContext) -> str:
        """Format context for inclusion in agent prompt."""
        
        sections = []
        
        # Customer context
        if context.customer_info:
            sections.append(f"""
## Customer Context
- Company: {context.customer_info.get('company_name')}
- Industry: {context.customer_info.get('industry')}
- Tier: {context.customer_info.get('tier')}
- Certifications: {', '.join(context.customer_info.get('certifications', []))}
""")
        
        # Relevant memories
        if context.semantic_memories:
            memory_text = "\n".join([
                f"- {m['content'][:200]}... (relevance: {m['similarity']:.2f})"
                for m in context.semantic_memories[:3]
            ])
            sections.append(f"""
## Relevant Knowledge
{memory_text}
""")
        
        # Similar past episodes (few-shot examples)
        if context.similar_episodes:
            episodes_text = "\n".join([
                f"User asked: {e['user_message'][:100]}...\nYou responded: {e['agent_response'][:150]}..."
                for e in context.similar_episodes[:2]
            ])
            sections.append(f"""
## Similar Past Interactions
{episodes_text}
""")
        
        # Regulatory grounding
        if context.relevant_regulations:
            reg_text = "\n".join([
                f"- {r['regulation_name']} Art. {r.get('article_number', 'N/A')}: {r['content'][:200]}..."
                for r in context.relevant_regulations[:2]
            ])
            sections.append(f"""
## Relevant Regulations
{reg_text}
""")
        
        # Procedural hints
        if context.procedural_hints:
            sections.append(f"""
## Recommended Approach
Based on {context.procedural_hints.get('success_count', 0)} successful completions:
Tools to use: {context.procedural_hints.get('tools', [])}
Typical sequence: {context.procedural_hints.get('sequence', 'N/A')}
""")
        
        return "\n".join(sections)
```

---

## 5.6 Cost Analysis

### Supabase Pro Tier

```
Monthly costs:
├── Database compute: €25 base
├── Storage (estimated 50GB): Included
├── Egress (100GB): €9
├── pgVector operations: Included
└── Total Supabase: ~€34/month
```

### Embedding Costs

```
OpenAI text-embedding-3-small:
├── Cost: €0.02/1M tokens
├── Estimated monthly usage: 500K tokens
└── Monthly cost: €0.01

Alternative (if needed):
├── Cohere Embed v3: €0.10/1M tokens
├── Self-hosted (sentence-transformers): €0 (CPU only)
```

### Total Memory System Cost

| Component | Monthly Cost |
|-----------|--------------|
| Supabase Pro | €34.00 |
| OpenAI Embeddings | €0.01 |
| **Total** | **€34.01/month** |

---

## References

1. Supabase Team. (2025). *Supabase Vector Documentation*. Supabase. https://supabase.com/docs/guides/ai

2. Endo, T. (2025). *Why AI Startups Choose PostgreSQL: Supabase, Neon, pgVector*. Medium. https://medium.com/@takafumi.endo/why-ai-startups-choose-postgresql

3. OpenAI. (2025). *Embeddings API Reference*. OpenAI Platform. https://platform.openai.com/docs/guides/embeddings

---

## 5.7 TypeScript Memory Service (DWS7 Modernization)

**Added:** 2026-03-22 | **Inspired by:** Supermemory (supermemoryai)

The Python `MemoryManager` (Section 5.3) is the reference design. The production
implementation is a TypeScript service that integrates directly with the DWS7
agent system, MCP server, and agentic loop.

### Implementation Files

| File | Purpose |
|------|---------|
| `src/agents/memory.types.ts` | Type definitions (MemoryItem, StoreInput, RecallInput, Profile) |
| `src/agents/memory.service.ts` | Core service: store, recall, forget, getProfile |
| `src/agents/tools.ts` | Agent tools: memory_store, memory_recall, memory_forget |
| `src/mcp/agent-server.ts` | MCP tools: dws_memory_store/recall/forget/profile |
| `supabase/migrations/047_hybrid_memory_search.sql` | Hybrid search, soft-delete, access tracking |

### Key Improvements over Python Reference

1. **Hybrid Search** — Combines pgVector cosine similarity with pg_trgm text matching. Configurable weights (default: 70% vector, 30% text). Falls back to text-only when OpenAI API unavailable.

2. **LRU Cache** — 1000-entry, 5-minute TTL cache for repeated recall queries. Invalidated on store/forget.

3. **Duplicate Detection** — Before storing, checks for near-duplicates (similarity > 0.95). Touches existing memory instead of creating duplicate.

4. **Soft-Delete** — `forget()` marks memories with `expired_at` instead of deleting. Audit-logged for 7-year compliance. `superseded_by` for contradiction resolution.

5. **Org-Scoped Isolation** — All queries filtered by `org_id`. Memory tools inject `context.orgId` automatically.

6. **User/Org Profiles** — `getProfile()` aggregates facts, preferences, and recent context into a ~50ms-retrievable profile.

7. **MCP-Accessible** — All memory operations exposed as MCP tools, usable from Claude Code, Cursor, or any MCP client.

8. **Agentic Loop Integration** — `memory_store` and `memory_recall` available as built-in tools in every agent's observe-think-act loop.

### Supermemory Self-Host Plan (Phase 4 — Future)

Supermemory MCP server can be self-hosted on Cloudflare Workers (EU region) for:
- Cross-platform memory (shared between Claude Code, Cursor, VS Code sessions)
- External connector sync (Google Drive, Gmail, Notion → DWS semantic_memories)
- Universal memory hub independent of any single AI platform

**Decision:** Self-host in EU. Supermemory as supplementary connector, Supabase remains source of truth.

### Memory Tool Usage in Agent Loop

```typescript
// Agents can store memories during execution
const tools = [BUILTIN_TOOLS.memory_store, BUILTIN_TOOLS.memory_recall];
const result = await this.runLoop(context, systemPrompt, userMessage, tools);

// Or via the memory service directly
const memories = await this.memory.recall({
  query: 'customer compliance requirements',
  orgId: context.orgId,
  memoryType: 'knowledge',
});
```

---

**Phase Complete Checklist:**
- [x] Database schema designed
- [x] Memory manager implemented (Python reference)
- [x] TypeScript memory service implemented (DWS7)
- [x] Hybrid search (vector + text) implemented
- [x] MCP memory tools exposed
- [x] Agent loop integration
- [x] LRU cache for recall performance
- [x] RAG pipeline configured
- [x] Context builder created
- [x] GDPR compliance (deletion) implemented
- [x] Cost analysis completed
- [ ] Supermemory self-host integration (Phase 4)
- [ ] Fact extraction + contradiction resolution (Phase 2)
- [ ] Memory consolidation + decay (Phase 3)

**Next Phase:** Proceed to `06-PROMPT-ENGINEERING.md` for system prompt design.
