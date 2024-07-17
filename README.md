# Angular Smart Form Filler

The Smart Form Filler fills in form fields based on unstructured user data, e.g. email content.
Add a call to `provideFormFiller()` in your application config to use the form filler.
You need to specify a backend to use the form filler. Currently, there are the following backends:

* The OpenAI backend (`withOpenAIBackend()`) talks to a OpenAI-compatible implementation such as OpenAI, Azure OpenAI, MistralAI, Groq, and others. It requires Internet access.
* The OpenAI tool backend (`withOpenAIToolBackend()`) behaves as the OpenAI backend, but makes use of tools (previously function calling).
* The experimental WebLLM backend (`withWebLLMBackend()`) uses WebLLM to execute a large language model locally. The initial download takes a relatively long time, but model inference is offline-capable from then on. The model download must be repeated for each origin.
* The experimental Prompt API backend (`withPromptAPIBackend()`) uses Chrome’s experimental [Prompt API](https://github.com/explainers-by-googlers/prompt-api) to communicate with a local LLM. The model, shared across origins, cannot be specified but is fully offline-capable once downloaded.

## Run this project

The demo project is configured to use OpenAI by default.
You can also use another OpenAI-compatible provider (e.g., Groq).

Before running the demo, you will need to set your OpenAI key by using the environment variable `OPENAI_API_KEY`.
Use the same variable to set your API key for any other OpenAI-compatible provider.

Run `npm start`.

## Inspiration

This project was heavily inspired by Steve Sanderson’s [Smart Components for Blazor](https://github.com/dotnet-smartcomponents/smartcomponents).

## License and Note

BSD-3-Clause.

This is a technical showcase, not an official Thinktecture product.
