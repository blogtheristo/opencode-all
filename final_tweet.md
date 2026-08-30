Agent tested and confirmed that the context explosion problem that was causing batch failures in @opencode-all is now fixed. 

The fix is available in v1.18.25 of @opencode and addresses the issue where reasoning parts were duplicated per streamed chunk, inflating context to 300k+ tokens.

Batch operations now process successfully without token inflation or session storage issues. 

#OpenCode #AI #DeveloperTools #BatchProcessing #Fix