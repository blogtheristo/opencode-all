---
title: "(LSJ) Context engineering advanced"
date: 2025-11-04
slug: context-engineering
type: post
---

<div class="sqs-html-content" data-sqsp-text-block-content>
  <p class="" style="white-space:pre-wrap;"><strong>Paper:</strong> <em>A Survey of Context Engineering for Large Language Models</em></p><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong>Authors:</strong> Lingrui Mei, Jiayu Yao, Yuyao Ge, Yiwei Wang, Baolong Bi, Yujun Cai, Jiazhi Liu, Mingyu Li, Zhong-Zhi Li, Duzhen Zhang, Chenlin Zhou, Jiayi Mao, Tianze Xia, Jiafeng Guo, and Shenghua Liu.</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Source:</strong> arXiv e-print (Preprint)</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Date:</strong> July 2025</p></li></ul><h3 style="white-space:pre-wrap;">Reference List</h3><p class="" style="white-space:pre-wrap;"><br></p><p class="" style="white-space:pre-wrap;"><strong>Journal Articles &amp; Preprints</strong></p><ol data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Mei, L., Yao, J., Ge, Y., et al. (2025) <em>A Survey of Context Engineering for Large Language Models</em>. arXiv preprint [2507.13334]. Available at: <a href="https://arxiv.org/abs/2507.13334" target="_blank">https://arxiv.org/abs/2507.13334</a> (Accessed: 4 November 2025).</p></li><li><p class="" style="white-space:pre-wrap;">Lewis, P., Oğuz, B., Yarats, D., et al. (2020) ‘Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks’. In: <em>Advances in Neural Information Processing Systems 33</em>. Vancouver, Canada: NeurIPS.</p></li><li><p class="" style="white-space:pre-wrap;">Brown, T. B., Mann, B., Ryder, N., et al. (2020) ‘Language Models are Few-Shot Learners’. In: <em>Advances in Neural Information Processing Systems 33</em>. Vancouver, Canada: NeurIPS.</p></li></ol><p class="" style="white-space:pre-wrap;"><strong>Technical Reports &amp; Online Guides</strong></p><ol data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Anthropic (2025) <em>Effective context engineering for AI agents</em>. Available at: <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" target="_blank">https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents</a> (Accessed: 4 November 2025).</p></li><li><p class="" style="white-space:pre-wrap;">LlamaIndex (2025) <em>Context Engineering – What it is, and techniques to consider</em>. Available at: <a href="https://www.llamaindex.ai/blog/context-engineering-what-it-is-and-techniques-to-consider" target="_blank">https://www.llamaindex.ai/blog/context-engineering-what-it-is-and-techniques-to-consider</a> (Accessed: 4 November 2025).</p></li></ol><p class="" style="white-space:pre-wrap;"><br></p><h2 style="white-space:pre-wrap;">2. Notable Products and Frameworks in the Market</h2><p class="" style="white-space:pre-wrap;"><br></p><p class="" style="white-space:pre-wrap;">Context Engineering is primarily implemented using open-source frameworks and vendor platforms that specialize in building LLM applications, especially those relying on RAG and Agent architectures.</p><h3 style="white-space:pre-wrap;"><strong>LangChain is a </strong>Development Framework </h3><p class="" style="white-space:pre-wrap;">LangChain Provides a cohesive framework for building <strong>agentic workflows</strong> and <strong>RAG pipelines</strong>. It offers modules for memory management, tool calling, and chaining LLM steps, which are all fundamental to context orchestration. </p><h3 style="white-space:pre-wrap;"><strong>LlamaIndex is </strong>Data Framework</h3><p class="" style="white-space:pre-wrap;">LlamaIndex Specializes in connecting LLMs to external data sources. It is core to the <strong>Retrieval</strong> component of context engineering, offering various indexing and query transformation strategies to retrieve the most relevant information for the context window.</p><h3 style="white-space:pre-wrap;"><strong>LlamaStack is </strong>Integrated Ecosystem</h3><p class="" style="white-space:pre-wrap;">A framework and ecosystem built to specifically simplify the creation and deployment of applications using <strong>Meta's Llama models</strong>. Focuses on optimized data processing, training, and streamlined inference/deployment for Llama-based context.</p><h3 style="white-space:pre-wrap;"><strong>Weaviate / Pinecone are </strong>Vector Databases</h3><p class="" style="white-space:pre-wrap;">These are the storage backends for <strong>long-term memory</strong> and external knowledge. They allow for semantic search, enabling the Retrieval-Augmented Generation (RAG) process that feeds precise, context-specific information to the LLM.</p><h3 style="white-space:pre-wrap;"><strong>Zep is </strong>Context Management Platform</h3><p class="" style="white-space:pre-wrap;">A dedicated platform for managing complex conversational memory and state. It specifically addresses challenges related to session history, user profiles, and filtering context for long-running AI applications.</p><h3 style="white-space:pre-wrap;"><strong>AutoGen is </strong>Multi-Agent Framework </h3><p class="" style="white-space:pre-wrap;">Developed by Microsoft, it focuses on building <strong>multi-agent systems</strong> where different AI agents collaborate to solve complex tasks. Context engineering here involves defining communication protocols and isolating context for each sub-agent.</p>
</div>




















  
  





<div class="sqs-html-content" data-sqsp-text-block-content>
  <h3 style="white-space:pre-wrap;"><strong>Microsoft Agent Framework is </strong>Agent Orchestration Framework</h3><p class="" style="white-space:pre-wrap;">A comprehensive, open-source SDK combining the strengths of <strong>AutoGen</strong> and <strong>Semantic Kernel</strong>. It features graph-based workflows, robust state/context management, and high control over multi-agent execution paths.</p><h3 style="white-space:pre-wrap;"><strong>Microsoft Agent Lightning is </strong>Optimization Framework</h3><p class="" style="white-space:pre-wrap;">A cutting-edge framework that enables <strong>Reinforcement Learning (RL)-based training</strong> of <em>any</em> existing AI agent (e.g., those built with LangChain, AutoGen) by decoupling training from execution. Focuses on optimizing agent behavior and long-horizon context logic.</p><h3 style="white-space:pre-wrap;"><strong>Google (Vertex AI &amp; Gemini)</strong>Platform / Model Suite</h3><p class="" style="white-space:pre-wrap;">Emphasizes the use of <strong>massive context windows</strong> (e.g., 1M+ tokens in Gemini models) to directly handle large amounts of multimodal context (text, video, audio) in one call. <strong>Vertex AI Agent Builder</strong> provides enterprise tools for designing and deploying agents.</p><h3 style="white-space:pre-wrap;"><strong>Meta (Research Focus)</strong></h3><p class="" style="white-space:pre-wrap;">Research / Open SourceMeta's approach often centers on <strong>optimizing their Llama family of models</strong> for efficiency and context handling. Research highlights include frameworks for <strong>autonomous context auditing</strong> and <strong>continuous learning</strong> where an agent enriches conversation history with structured metadata/tags to manage its own knowledge base.</p><h3 style="white-space:pre-wrap;"><strong>LangGraph </strong>Graph-based Orchestration </h3><p class="" style="white-space:pre-wrap;">An extension of LangChain that allows for <strong>stateful, cyclical workflows</strong> using graphs. It provides fine-grained control over which components (RAG, memory, tool calls) are executed and what context is passed at <em>each step</em> of a complex multi-agent process.</p>
</div>




















  
  






  
      <img src="https://images.squarespace-cdn.com/content/v1/54c48881e4b0d7a7fa7eddf4/2f536542-8046-42c1-849e-12a1eb09c9f4/IMG_5692.jpeg?format=original" alt=""/>
