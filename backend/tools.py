
import os
import requests

from bs4 import BeautifulSoup
from tavily import TavilyClient
from dotenv import load_dotenv
from langchain.tools import tool


load_dotenv()

api_key = os.getenv("TAVILY_API_KEY")

if not api_key:
    raise ValueError("TAVILY_API_KEY is missing from .env")

tavily = TavilyClient(api_key=api_key)


@tool
def web_search(query: str) -> str:
    """
    Search the web for recent and reliable information.
    Returns titles, URLs and snippets.
    """

    try:
        results = tavily.search(
            query=query,
            max_results=5
        )

        output = []

        for result in results.get("results", []):

            output.append(
                f"Title: {result.get('title', 'Untitled')}\n"
                f"URL: {result.get('url', '')}\n"
                f"Snippet: {result.get('content', '')[:500]}\n"
            )

        return "\n---\n".join(output) or "No search results found."

    except Exception as error:
        return f"Web search failed: {str(error)}"


@tool
def scrape_url(url: str) -> str:
    """
    Scrape and return clean text content from a given URL.
    """

    try:
        if not url.startswith(("http://", "https://")):
            return "Invalid URL."

        response = requests.get(
            url,
            timeout=15,
            headers={
                "User-Agent": "Mozilla/5.0"
            }
        )

        response.raise_for_status()

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        for tag in soup([
            "script",
            "style",
            "nav",
            "footer",
            "header",
            "noscript"
        ]):
            tag.decompose()

        text = soup.get_text(
            separator=" ",
            strip=True
        )

        return text[:8000] or "No readable content found."

    except Exception as error:
        return f"Could not scrape URL: {str(error)}"
