---
title: "Into the world of Large Language Models"
date: "2023-07-21"
excerp: ""
cover_image: "/images/posts/langquest/llm-cover.jpg"
---

_*This post is still being updated*_

## Table of Contents
1. [Introduction](#introduction)
2. [Access to LLM inference](#llm)
3. [LangChain](#langchain)


## Introduction <a name="introduction"></a>
In recent times, Large Language Models (LLM) have been taking the world by storm, sparking much excitements and debates. In this post, I want to dig deeper into the world of LLMs from a technical point of view geared toward building applications.

To put together an LLM application, there are a few components.
- Options to run LLM: e.g., ChatGPT, local Hugging Face model via FastAPI, or local [text-generation-webui](https://github.com/oobabooga/text-generation-webui) server.
- Core application framework: e.g., [LangChain](https://github.com/hwchase17/langchain).
- Persistent information with vector databases.
- Front-end component for users to be able to interact with the application.

I will touch upon each of the above listed components. The goal is to be able to put together a conversational agent that can leverage its fictional background and conversation history with the user.

## Access to LLM inference <a name="llm"></a>
Large language models are text generation models. Namely, with each call, we pass in some text, and the model will generate likely responses which could be question answering, text completion, language translation, and more. At the core, current LLMs are simply functions that generate text, where function calls are independent of one another. 

For developers, the simplest way to get access to LLM is probably through [OpenAI](https://platform.openai.com/) API and its [Python library](https://github.com/openai/openai-python). Of course, this is not open-source and has a corresponding pricing (more or less based on the number of words in each API call, measured in the number of *tokens*).

Alternatively, we can choose to run LLM on our local machine. We do want to keep in mind that this option does have some inherent system requirements such as RAM and VRAM, since there are models that are simply too large to be loaded onto an average home computer.
- One way to do this is to load models from Hugging Face (such as [Llama](https://huggingface.co/docs/transformers/main/en/model_doc/llama)) and serve through a local FastAPI server. This is very flexible as we can configure and tweak all of the pieces. For example, to alleviate memory requirements, one can choose to load in a *quantized* version of the model (see [Quantization](https://huggingface.co/docs/transformers/main/main_classes/quantization)), at the cost of prediction quality. There are efficient model quantization implementations such as GPTQ and GGML, the Hugging Face community has uploaded a variety of quantized models in these formats, making it a lot easier for people to get access to LLMs.
- The way I went with is [text-generation-webui](https://github.com/oobabooga/text-generation-webui), providing a way to quickly download and load models. It also supports running GPTQ and GGML models mentioned above. While not as important for application development, it provides UI for users to be able to quickly load, test, and chat with models. After installation, we want to run `python server.py --listen --api` to allow for API calls.
- One can also check out Hugging Face's [Text Generation Inference](https://github.com/huggingface/text-generation-inference).


## LangChain <a name="langchain"></a>
### Basic Components
LangChain is open-sourced framework used to build applications with LLMs. Its basic aim to is to facilitate application development. The core idea is to organize and formalize concepts such as prompts, memories. But what are these concepts?
- Prompting is a heuristic technique used to obtain desirable LLM inferences. For example, here is an input: 
```python
NORMAL_CONV = """
This is a conversation between between a human and an AI. If the AI does not know the answer, it says that it does not know.

Human: Hello there
AI:
"""
```
It gives the following LLM result: 
![](/images/posts/langquest/normal-convo.png "Normal Conversation")

Here is a slightly changed input

```python
PIRATE_CONV = """
This is a conversation between between a human and an AI. The AI talks in English pirate. If the AI does not know the answer, it says that it does not know.

Human: Hello there
AI:
"""
```
and the corresponding LLM result:
![](/images/posts/langquest/pirate-convo.png "Pirate Conversation")

- Memory is the ability of an application to retain states such as previous messages in a conversation. As we know, current LLM models are stateless, and each model call is independent. So, having a memory is a property of the application, and not of the model. For example, for a conversation, subsequent model calls could include previous messages or include a summary of previous messages. These types of inline memories are not quite infinite, but transformer-based models do have large context length (e.g., 4096 tokens for current ChatGPT, or 200k for Claude 2!).

To put everything together, LangChain formalizes prompting with `PromptTemplate` where human input is passed into the string variable. While one can certainly do this manually, there are many situations where one would want to reuse/combine/customize prompts, so this is a good level of abstraction. LangChain provides many different memory types such as `ConversationBufferMemory`, `ConversationSummaryMemory`, and `ConversationEntityMemory`. The prompt template and the memory objects can be passed into an `LLMChain`, which is the main driving force behind an application. Below is a quick workflow for a simple chatbot.

```python
from langchain import PromptTemplate, LLMChain
from langchain.memory import ConversationBufferMemory
TEMPLATE = """
This is a conversation between between a human and an AI. If the AI does not know the answer, it says that it does not know.

Conversation history:
{history}

Human: {input}
AI:
"""
# initialize your favourite llm interface, choose_your_llm is not an actual function!
llm = choose_your_llm()

prompt = PromptTemplate(input_variables=["history","input"],template=TEMPLATE)
memory = ConversationBufferMemory()
chain = LLMChain(llm=llm,prompt=promp,memory=memory)
chain.run(input="Hello there")
```

To use an LLM in a form that LangChain understands, one can use existing APIs and their [LangChain integrations](https://api.python.langchain.com/en/latest/api_reference.html#module-langchain.llms). Since I want to use a local LLM, LangChain allows to create a custom LLM interface. Below is a simple version of what I use to create an LLM wrapper to interact with my local text-generation-webui server (if other servers are used, we can simply tweak the code).

```python
from langchain.llms.base import LLM
import requests

class LocalLLMWrapper(LLM):
    url: str = 'http://127.0.0.1:5000/api/v1/generate'

    @property
    def _llm_type(self):
        return "custom"
    
    def _call(self, prompt):
        query_obj = {"prompt":prompt}
        headers = {"Content-Type":"application/json"}
        res = requests.post(self.url,headers=headers,json=query_obj)
        res = res.json()['results'][0]['text']
        return res

llm=LocalLLMWrapper()
```

One cool thing to notice is that the LLM wrapper does not depend on the actual model loaded on server side. So, one can easily try different models without having to change the application code.

*to be continued*