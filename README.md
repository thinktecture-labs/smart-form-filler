# Angular Forms Companion

AI-backed forms companion for Angular.

## OpenAI API Key

Set the OpenAI API key using the environment variable `OPENAI_API_KEY`.

## Run this project

Run `npm start`.

## Form Filler

The form filler fills in form fields based on unstructured user data, e.g. email content.
Add a call to `provideFormFiller()` in your application config to use the form filler.
You need to specify a backend to use the form filler. Currently, there are two backends:

* The OpenAI backend (`withOpenAIBackend()`) talks to a OpenAI-compatible implementation such as OpenAI, Azure OpenAI or Groq. It requires Internet access.
* The experimental WebLLM backend (`withWebLLMBackend()`) uses WebLLM to execute a large language model locally. The initial download takes a relatively long time, but model inference is offline-capable from then on.

## Inspiration

This project was inspired by Steve Sanderson’s [Smart Components for Blazor](https://github.com/dotnet-smartcomponents/smartcomponents).
