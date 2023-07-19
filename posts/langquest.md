---
title: "Into the world of Large Language Models"
date: "July 20 2023"
excerp: ""
cover_image: "/images/posts/langquest/llm-cover.jpg"
---

_*This post is still being updated*_

## Table of Contents
1. [Introduction](#introduction)
2. [Access to LLM](#llm)

## Introduction <a name="introduction"></a>
In recent times, Large Language Models (LLM) have been taking the world by storm, sparking much excitements and debates. In this post, I want to dig deeper into the world of LLMs from a technical point of view geared toward building applications.

To put together an LLM application, there are a few components.
- Options to run LLM: e.g., ChatGPT, local Hugging Face model via FastAPI, or local [text-generation-webui](https://github.com/oobabooga/text-generation-webui) server.
- Core application framework: e.g., [LangChain](https://github.com/hwchase17/langchain).
- Persistent information with vector databases.
- Frontend component for users to be able to interact with the application.

I will touch upon each of the above listed components. The goal is to be able to put together a conversational agent that can leverage its fictional background and conversation history with the user.

## Access to LLM <a name="llm"></a>
Large language models are text generation models. Namely, with each call, we pass in some text, and the model will generate likely responses which could be question answering, text completion, language translation, and more. At the core, current LLMs are simply functions that generate text, where function calls are independent of one another. 

For developers, the simplest way to get access to LLM is probably through [OpenAI](https://platform.openai.com/) API and its [Python library](https://github.com/openai/openai-python). Of course, this is not open-source and has a corresponding pricing (more or less based on the number of words in each API call).

Alternatively, we can choose to run LLM on our local machine. We do want to keep in mind that this option does have some inherent system requirements such as RAM and VRAM, since there are models that are simply too large to be loaded on an average home computer.
- One way to do this is to simply load and a model from Hugging Face (such as [Llama](https://huggingface.co/docs/transformers/main/en/model_doc/llama)) and serve through a local FastAPI server. This is very flexible as we can configure and tweak all of the pieces. For example, to alleviate memory requirements, one can choose to load in a *quantized* version of the model (see [Quantization](https://huggingface.co/docs/transformers/main/main_classes/quantization)), at the cost of prediction quality. There are efficient model quantization implementations such as GPTQ and GGML, the Hugging Face community has uploaded a variety of quantized models in these formats, making it a lot easier for people to get access to LLMs.
- The way I go with is [text-generation-webui](https://github.com/oobabooga/text-generation-webui), providing a way to quickly download and load models. It also supports running GPTQ and GGML models mentioned above. While not as important for application development, it provides UI for users to be able to quickly load, test, and chat with models. After installation, we want to run `python server.py --listen --api` to allow for API calls.