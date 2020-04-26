import React from "react";

const SearchItem = (props) => {
    const {sentenceId, content, docId, rate} = props.sentence;

    const onClick = () => {
        props.chooseTextView(docId);
    }

    return (
        <article className="doc-item">
            <p>rate: {rate}</p>
            {content}
            <button onClick={onClick}>Document</button>
        </article>
    )
}

export default SearchItem;