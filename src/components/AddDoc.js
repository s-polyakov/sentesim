import React, {useState} from "react"
import axios from "axios";
import packageJson from '../../package.json'

const AddDoc = props => {
    const serverURL = packageJson.serverURL;

    const [inputText, setInputText] = useState({
        content: "",
    });
    const [docStatus, setDocStatus] = useState("");

    const onTextChange = e => {
        setInputText({
            ...inputText,
            [e.target.name]: e.target.value,
        });
        setDocStatus("");
    };

    const closeMsg = () => {
        setDocStatus("");
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (inputText.content.length === 0) {
            setDocStatus("Document is empty");
        } else {
            axios.post(serverURL.concat("/add"), {doc: inputText.content})
                .then(response => {
                    const newDoc = {
                        id: response.data.docId,
                        title: response.data.title
                    };

                    props.addDocProps(newDoc);
                    setInputText({
                        content: "",
                    });
                    let msg = "Document was added.";
                    if (response.data.notFoundWords.length > 0) {
                        msg = msg + " Not found words: " + response.data.notFoundWords.join(", ");
                    }
                    setDocStatus(msg);
                }).catch(err => {
                console.log(err.message);
                props.onErrorProp(err);
            });
        }
    };

    const displayMessage = () => {
        if (docStatus.length > 0) {
            return <div className="info">
                <span className="closebtn" onClick={closeMsg}>&times;</span>
                {docStatus}
            </div>
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="form-container">
                <textarea className="input-text" name="content" rows="15" cols="100" value={inputText.content}
                          onChange={onTextChange}/>
                <div><input type="submit" className="input-submit" value="Add Document"/>
                </div>
            </form>
            {displayMessage()}
        </div>
    )
};

export default AddDoc
