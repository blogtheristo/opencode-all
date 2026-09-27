"""
Baseten Kimi K3 — minimal OpenAI-compatible client for DWS.

Model APIs endpoint: https://inference.baseten.co/v1
Model slug:          moonshotai/Kimi-K3

Secrets come from the environment ONLY (DWS Non-Negotiable Rules 1 & 2):

    export BASETEN_API_KEY=...            # never hardcode; rotate if leaked

Run:
    python examples/baseten-kimi-k3/kimi_k3_chat.py "Implement Hello World in Python"
"""

import os
import sys

from openai import OpenAI

BASE_URL = os.environ.get("BASETEN_BASE_URL", "https://inference.baseten.co/v1")
MODEL = os.environ.get("BASETEN_MODEL", "moonshotai/Kimi-K3")


def client() -> OpenAI:
    api_key = os.environ.get("BASETEN_API_KEY")
    if not api_key:
        raise SystemExit(
            "BASETEN_API_KEY is not set. Export it first — do not hardcode the key."
        )
    return OpenAI(api_key=api_key, base_url=BASE_URL)


def stream_completion(prompt: str) -> None:
    """Stream tokens as they arrive. (The upstream snippet read
    `response.choices[0].message.content` off a streamed response, which is
    empty for streams — you must iterate the chunks, as done here.)"""
    stream = client().chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=True,
        stream_options={"include_usage": True, "continuous_usage_stats": True},
        top_p=0.95,
        max_tokens=4096,
        temperature=1,
        presence_penalty=0,
        frequency_penalty=0,
    )
    for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
    print()


if __name__ == "__main__":
    user_prompt = " ".join(sys.argv[1:]) or "Implement Hello World in Python"
    stream_completion(user_prompt)
