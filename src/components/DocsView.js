import React from "react";
import DocItem from "./DocItem";

const DocsView = (props) => {
    return (
        <section>
            {props.docs.map(doc => (
                <DocItem
                    key={doc.id}
                    doc={doc}
                    chooseSentencesViewProps={props.chooseSentencesViewProps}
                />
            ))}
        </section>
    );
}

export default DocsView;