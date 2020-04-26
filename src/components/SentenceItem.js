import React from "react";

const SentenceItem = (props) => {
    console.log(props);
    const {id, content} = props.sentence;

    const onClick = () => {
        props.searchProps(id);
    }

    return <article className="doc-item">
        {content}
        <button onClick={onClick}>Search</button>
    </article>
}

export default SentenceItem;