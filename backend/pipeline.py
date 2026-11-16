
from agents import (
    build_search_agent,
    build_reader_agent,
    writer_chain,
    critic_chain
)


def get_final_message(response):

    messages = response.get("messages", [])

    for message in reversed(messages):

        content = getattr(message, "content", "")

        if isinstance(content, str) and content.strip():
            return content

        if isinstance(content, list):
            text_parts = [
                item.get("text", "")
                for item in content
                if isinstance(item, dict)
                and item.get("type") == "text"
            ]

            combined = "\n".join(text_parts)

            if combined.strip():
                return combined

    return "No response generated."


def run_research_pipeline(topic: str, progress_callback=None):

    state = {}

    def update(progress, message, current_step):

        if progress_callback:
            progress_callback(
                progress,
                message,
                current_step
            )

    # STEP 1: SEARCH AGENT

    update(
        10,
        "Search Agent is finding relevant web resources...",
        0
    )

    search_agent = build_search_agent()

    search_result = search_agent.invoke({

        "messages": [
            (
                "user",
                f"""
                Find recent, reliable and detailed information about:
                {topic}

                Use the web search tool.
                Return the titles, URLs and important findings.
                """
            )
        ]

    })

    state["search_results"] = get_final_message(search_result)

    # STEP 2: READER AGENT

    update(
        35,
        "Reader Agent is scraping and analyzing websites...",
        1
    )

    reader_agent = build_reader_agent()

    reader_result = reader_agent.invoke({

        "messages": [
            (
                "user",
                f"""
                Research topic: {topic}

                Search results:
                {state['search_results']}

                Choose the most relevant URL and scrape it.
                Return detailed findings from the website.
                """
            )
        ]

    })

    state["scraped_content"] = get_final_message(reader_result)

    # STEP 3: WRITER AGENT

    update(
        60,
        "Writer Agent is preparing your research report...",
        2
    )

    research_combined = (
        f"SEARCH RESULTS:\n"
        f"{state['search_results']}\n\n"
        f"SCRAPED CONTENT:\n"
        f"{state['scraped_content']}"
    )

    state["report"] = writer_chain.invoke({

        "topic": topic,
        "research": research_combined

    })

    # STEP 4: CRITIC AGENT

    update(
        85,
        "Critic Agent is evaluating report quality...",
        3
    )

    state["feedback"] = critic_chain.invoke({

        "report": state["report"]

    })

    update(
        100,
        "All agents completed successfully!",
        4
    )

    return state
