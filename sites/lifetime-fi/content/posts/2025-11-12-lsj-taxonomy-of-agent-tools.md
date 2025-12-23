---
title: "(LSJ) Taxonomy of Agent Tools"
date: 2025-11-12
slug: 2025-11-12-lsj-taxonomy-of-agent-tools
type: post
---

<div class="sqs-html-content" data-sqsp-text-block-content>
  <h2 style="white-space:pre-wrap;">Taxonomy of Agent Tools </h2><p class="" style="white-space:pre-wrap;">One way of categorizing agent tools is by their primary function, or the various types of interactions they facilitate. Here’s an overview of common types: </p><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong>Information Retrieval:</strong> Allow agents to fetch data from various sources, such as web searches, databases, or unstructured documents. </p></li><li><p class="" style="white-space:pre-wrap;"><strong>Action / Execution</strong>: Allow agents to perform real-world operations: sending emails, posting messages, initiating code execution, or controlling physical devices. </p></li><li><p class="" style="white-space:pre-wrap;"><strong>System / API Integration:</strong> Allow agents to connect with existing software systems and APIs, integrate into enterprise workflows, or interact with third-party services. </p></li><li><p class="" style="white-space:pre-wrap;"><strong>Human-in-the-Loop:</strong> Facilitate collaboration with human users: ask for clarification, seek approval for critical actions, or hand off tasks for human judgment. </p><h2 style="white-space:pre-wrap;">🔧 Design Guide for Tool Categories</h2><h3 style="white-space:pre-wrap;">1. Structured Data Retrieval</h3><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong>Use Case:</strong> Querying databases, spreadsheets, or structured sources (e.g., sales data in SQL, employee records in Excel).</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Design Tips:</strong></p><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Define schemas clearly (e.g., customer_id, order_date, product_name).</p></li><li><p class="" style="white-space:pre-wrap;">Optimize queries for speed (indexes, joins).</p></li><li><p class="" style="white-space:pre-wrap;">Handle data types carefully (dates, decimals, text).</p></li></ul></li><li><p class="" style="white-space:pre-wrap;"><strong>Workflow Example:</strong> <br>A retail company wants to analyze monthly sales. A structured retrieval tool queries the SQL database for <code>SUM(sales)</code> grouped by month, then feeds results into a dashboard.</p></li></ul><h3 style="white-space:pre-wrap;">2. Unstructured Data Retrieval</h3><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong>Use Case:</strong> Searching documents, web pages, or knowledge bases (e.g., customer support tickets, research papers).</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Design Tips:</strong></p><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Use semantic search or embeddings for relevance.</p></li><li><p class="" style="white-space:pre-wrap;">Manage context window limits (chunking long documents).</p></li><li><p class="" style="white-space:pre-wrap;">Provide clear retrieval instructions (e.g., “return top 5 most relevant passages”).</p></li></ul></li><li><p class="" style="white-space:pre-wrap;"><strong>Workflow Example:</strong> <br>A chatbot answers customer questions by retrieving relevant sections from a product manual using RAG (Retrieval-Augmented Generation).</p></li></ul><h3 style="white-space:pre-wrap;">3. Connecting to Built-in Templates</h3><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong>Use Case:</strong> Generating content from predefined templates (e.g., email drafts, reports, contracts).</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Design Tips:</strong></p><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Ensure parameters are well-defined (e.g., recipient name, subject line).</p></li><li><p class="" style="white-space:pre-wrap;">Provide guidance on template selection (formal vs. casual tone).</p></li></ul></li><li><p class="" style="white-space:pre-wrap;"><strong>Workflow Example:</strong> <br>HR uses a template connector to auto-generate offer letters. The system fills in candidate name, role, and salary into a predefined document template.</p></li></ul><h3 style="white-space:pre-wrap;">4. Google Connectors</h3><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong>Use Case:</strong> Interacting with Google Workspace apps (Gmail, Drive, Calendar).</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Design Tips:</strong></p><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Leverage Google APIs with proper authentication.</p></li><li><p class="" style="white-space:pre-wrap;">Handle API rate limits gracefully.</p></li><li><p class="" style="white-space:pre-wrap;">Ensure authorization scopes are minimal and secure.</p></li></ul></li><li><p class="" style="white-space:pre-wrap;"><strong>Workflow Example:</strong> <br>A project management assistant automatically schedules meetings in Google Calendar and sends invites via Gmail when a new task is assigned.</p></li></ul><h3 style="white-space:pre-wrap;">5. Third-Party Connectors</h3><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong>Use Case:</strong> Integrating with external services and applications (e.g., Slack, Salesforce, payment gateways).</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Design Tips:</strong></p><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;">Document API specifications clearly.</p></li><li><p class="" style="white-space:pre-wrap;">Manage API keys securely (vaults, environment variables).</p></li><li><p class="" style="white-space:pre-wrap;">Implement error handling (retry logic, fallback).</p></li></ul></li><li><p class="" style="white-space:pre-wrap;"><strong>Workflow Example:</strong> <br>A sales dashboard pulls live CRM data from Salesforce, enriches it with external market data, and pushes alerts to Slack when a deal progresses.</p></li></ul><h2 style="white-space:pre-wrap;">🔄 End-to-End Workflow Example</h2><p class="" style="white-space:pre-wrap;">Imagine building a <strong>customer support assistant</strong>:</p><ol data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong>Structured Retrieval:</strong> Pull customer order history from SQL.</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Unstructured Retrieval:</strong> Search knowledge base for troubleshooting guides.</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Template Connector:</strong> Generate a response email using a predefined support template.</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Google Connector:</strong> Attach relevant documents from Google Drive.</p></li><li><p class="" style="white-space:pre-wrap;"><strong>Third-Party Connector:</strong> Log the interaction in Salesforce for tracking.</p></li></ol><p class="" style="white-space:pre-wrap;">This layered approach ensures the assistant is <strong>data-driven, context-aware, and seamlessly integrated</strong> into existing workflows.</p><p class="" style="white-space:pre-wrap;">👉 <strong>Workflow Diagram</strong></p></li></ul>
</div>




















  
  






  
      <img src="https://images.squarespace-cdn.com/content/v1/54c48881e4b0d7a7fa7eddf4/35bbdb80-900f-4950-8d05-6abe95ca4db8/workflow1.png?format=original" alt=""/>
  




  
      <img src="https://images.squarespace-cdn.com/content/v1/54c48881e4b0d7a7fa7eddf4/d8c0ad2d-29b5-44c3-b53c-e574552854cd/workflow2.png?format=original" alt=""/>
  




  
      <img src="https://images.squarespace-cdn.com/content/v1/54c48881e4b0d7a7fa7eddf4/e2f6629b-97ae-4eb1-bcfc-b0db978d1b60/workflow3.png?format=original" alt=""/>
