import React, {useEffect, useState} from "react"
import Header from "./Header"
import AddDoc from "./AddDoc"
import DocsView from "./DocsView"
import SentencesView from "./SentencesView"
import SearchView from "./SearchView"
import TextView from "./TextView"
import axios from "axios"
import packageJson from '../../package.json'

const modeEnum = {
    DOCS_VIEW: 1,
    SENTENCES_VIEW: 2,
    SEARCH_VIEW: 3,
    TEXT_VIEW: 4
}

const AppContainer = props => {
    const serverURL = packageJson.serverURL;

    const [docs, setDocs] = useState([]);
    const [mode, setMode] = useState(modeEnum.DOCS_VIEW);
    const [curDocId, setCurDocId] = useState(null);
    const [curSentenceId, setCurSentenceId] = useState(null);
    const [curTextId, setCurTextId] = useState(null);
    const [curPage, setCurPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
            axios.get(serverURL.concat("/number_of_pages"))
                .then(response => {
                        setNumberOfPages(response.data.numberOfPages);
                        setCurPage(1);
                    }
                ).catch(err => {
                    console.log(err.message);
                    onError(err);
            });
        },
        []
    );

    //load page with documents
    useEffect(
        () => {
            axios.get(serverURL.concat("/doc_titles_page"),
                {params: {pageNum: curPage}}
            ).then((response) => {
                setDocs(response.data.doc_titles);
            }).catch(err => {
                    console.log(err.message);
                    onError(err);
            });

        },
        [curPage]
    );


    const goNextPage = () => {
        if (curPage < numberOfPages) {
            setCurPage(curPage + 1);
        }
    };

    const goPrevPage = () => {
        if (curPage > 1) {
            setCurPage(curPage - 1);
        }
    };

    const addDoc = newDoc => {
        //setDocs([...docs, newDoc]);
        axios.get(serverURL.concat("/number_of_pages"))
            .then(response => {
                    setNumberOfPages(response.data.numberOfPages);
                    if (curPage === response.data.numberOfPages) {//if page is last then update view to show last added doc
                        axios.get(serverURL.concat("/doc_titles_page"),
                            {params: {pageNum: curPage}}
                        ).then((response) => {
                            setDocs(response.data.doc_titles);
                        });
                    }
                }
            ).catch(err => {
                console.log(err.message);
                onError(err);
        });
    };

    const chooseTextView = (docId) => {
        console.log(`chooseTextView ${docId}`);
        setCurTextId(docId);
        setMode(modeEnum.TEXT_VIEW)
    }

    const chooseSearchView = (docId, sentenceId) => {
        // console.log(`${docId} ${sentenceId}`);
        setCurDocId(docId);
        setCurSentenceId(sentenceId);
        setMode(modeEnum.SEARCH_VIEW);
    };

    const chooseSentencesView = (id) => {
        setMode(modeEnum.SENTENCES_VIEW);
        setCurDocId(id);
    }

    const returnToDocumentsView = () => {
        setErrMsg("");
        setMode(modeEnum.DOCS_VIEW);
    };

    const returnToSentencesView = () => {
        setErrMsg("");
        setMode(modeEnum.SENTENCES_VIEW);
    };

    const returnToSearchView = () => {
        setErrMsg("");
        setMode(modeEnum.SEARCH_VIEW);
    };

    const onError = err => {
        setErrMsg(err.message)
    };

    const onCloseErrMsg = () => {
        setErrMsg("");
    };

    const closeAlert = () => {
        setErrMsg("");
    };

    const displayError = () => {
        if (errMsg.length > 0) {
            return <div className="alert">
                <span className="closebtn" onClick={closeAlert}>&times;</span>
                {errMsg}
            </div>
        }
    };

    if (mode === modeEnum.DOCS_VIEW) {
        return (
            <div className="container">
                <Header/>
                {displayError()}
                <main>
                    <AddDoc addDocProps={addDoc} onErrorProp={onError}/>
                    <DocsView
                        docs={docs}
                        chooseSentencesViewProps={chooseSentencesView}
                    />
                </main>
                {(() => {
                    if (numberOfPages !== 0) {
                        return <div className="page-numbering">
                            <button onClick={goPrevPage}>&lt;</button>
                            <span className="page-number">page {curPage} of {numberOfPages}</span>
                            <button onClick={goNextPage}>&gt;</button>
                        </div>
                    }
                })()}
            </div>
        )
    } else if (mode === modeEnum.SENTENCES_VIEW) {
        return (
            <div className="container">
                <Header/>
                {displayError()}
                <main>
                    <ul className="breadcrumb">
                        <li><button onClick={returnToDocumentsView}>Documents</button></li>
                        <li>Sentences</li>
                    </ul>
                    <SentencesView docId={curDocId}
                                   chooseSearchViewProps={chooseSearchView}
                                   onErrorProp={onError}/>
                </main>
            </div>
        )
    } else if (mode === modeEnum.SEARCH_VIEW) {
        return (<div className="container">
                <Header/>
                {displayError()}
                <main>
                    <ul className="breadcrumb">
                        <li><button onClick={returnToDocumentsView}>Documents</button></li>
                        <li><button onClick={returnToSentencesView}>Sentences</button></li>
                        <li>Search</li>
                    </ul>
                    <SearchView docId={curDocId}
                                sentenceId={curSentenceId}
                                chooseTextView={chooseTextView}
                                onErrorProp={onError}/>
                </main>
            </div>
        )
    } else if (mode === modeEnum.TEXT_VIEW) {
        return (<div className="container">
                <Header/>
                {displayError()}
                <main>
                    <ul className="breadcrumb">
                        <li><button onClick={returnToDocumentsView}>Documents</button></li>
                        <li><button onClick={returnToSentencesView}>Sentences</button></li>
                        <li><button onClick={returnToSearchView}>Search</button></li>
                        <li>Document Text</li>
                    </ul>
                    <TextView docId={curTextId}
                                onErrorProp={onError}/>
                </main>
            </div>
        )
    }
};

export default AppContainer