import React from "react"

const DocItem = props => {
  const { id, title } = props.doc
  const onClick = () => {
    props.chooseSentencesViewProps(id);
    //() => props.expandSentencesProps(id);
  }

  return (
    <article className="doc-item" key={id}>
      {title}
      <button onClick={onClick}>By Sentences</button>
    </article>
  )
}

export default DocItem
