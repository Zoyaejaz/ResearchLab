
from langchain.agents import create_agent
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv
from tools import web_search, scrape_url

import os


load_dotenv()

if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY is missing from .env")


llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0
)


# ----------------------------------
# SEARCH AGENT
# ----------------------------------

def build_search_agent():

    return create_agent(
        model=llm,
        tools=[web_search],
        system_prompt="""
        You are a professional web research agent.

        Your task is to:
        1. Search the web using the available search tool.
        2. Find recent and reliable information.
        3. Return relevant titles, URLs and useful findings.
        4. Avoid inventing sources.
        5. Present the findings clearly.
        """
    )


# ----------------------------------
# READER AGENT
# ----------------------------------

def build_reader_agent():

    return create_agent(
        model=llm,
        tools=[scrape_url],
        system_prompt="""
        You are a professional research reading agent.

        Your task is to:
        1. Analyze the search results.
        2. Select the most relevant URL.
        3. Use the scraping tool to extract its content.
        4. Summarize important findings.
        5. Return factual information.
        6. Do not invent website content.
        """
    )


# ----------------------------------
# WRITER CHAIN
# ----------------------------------

writer_prompt = ChatPromptTemplate.from_messages([

    (
        "system",
        """
        You are an expert research writer.

        Create detailed, structured, factual
        and insightful research reports.
        """
    ),

    (
        "human",
        """
        Write a detailed research report.

        Topic:
        {topic}

        Research Gathered:
        {research}

        Structure:

        1. Introduction
        2. Key Findings (minimum 3)
        3. Detailed Analysis
        4. Conclusion
        5. Sources (include URLs from the research)

        Use clear Markdown formatting.
        Never invent facts or sources.
        """
    )

])

writer_chain = (
    writer_prompt
    | llm
    | StrOutputParser()
)


# ----------------------------------
# CRITIC CHAIN
# ----------------------------------

critic_prompt = ChatPromptTemplate.from_messages([

    (
        "system",
        """
        You are a sharp and constructive
        research report critic.

        Evaluate reports honestly.
        Do not give inflated scores.
        """
    ),

    (
        "human",
        """
        Evaluate the following research report.

        Report:
        {report}

        Use this exact format:

        Score: X/10

        Strengths:
        - ...
        - ...

        Areas to Improve:
        - ...
        - ...

        One line verdict:
        ...
        """
    )

])

critic_chain = (
    critic_prompt
    | llm
    | StrOutputParser()
)
