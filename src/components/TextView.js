import React, {useState, useEffect} from "react";
import axios from "axios";

const TextView = (props) => {
    const serverURL = window.serverURL;

    const docId = props.docId;

    const [doc, setDoc] = useState(null);
    useEffect(
        () => {
            axios.get(
                serverURL.concat("/doctext"),
                {params:{docId:docId}}
            ).then(
                (response) => {
                    setDoc(response.data.docText);
                }
            ).catch(err => {
                console.log(err.message);
                props.onErrorProp(err);
            })
        },
        []
    );

    return (<article>
            <p>{doc}</p>
        </article>
    )
}

export default TextView;