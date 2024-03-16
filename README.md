# Angular Forms Companion

AI-backed forms companion for Angular.

## Run this project

The demo project is configured to use Groq by default.
This platform currently offers the fastest model inference.
But you can also use OpenAI or another provider.

Before running the demo, you will need to set your OpenAI key by using the environment variable `OPENAI_API_KEY`.
Use the same variable to set your API key for Groq or any other OpenAI-compatible provider.

Run `npm start`.

## Form Filler

The form filler fills in form fields based on unstructured user data, e.g. email content.
Add a call to `provideFormFiller()` in your application config to use the form filler.
You need to specify a backend to use the form filler. Currently, there are two backends:

* The OpenAI backend (`withOpenAIBackend()`) talks to a OpenAI-compatible implementation such as OpenAI, Azure OpenAI, MistralAI, Groq, and others. It requires Internet access.
* The experimental WebLLM backend (`withWebLLMBackend()`) uses WebLLM to execute a large language model locally. The initial download takes a relatively long time, but model inference is offline-capable from then on.

## Inspiration

This project was heavily inspired by Steve Sanderson’s [Smart Components for Blazor](https://github.com/dotnet-smartcomponents/smartcomponents).
