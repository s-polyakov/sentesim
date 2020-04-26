import React, {useState, useEffect} from "react";
import axios from "axios";
import SentenceItem from "./SentenceItem";


const SentencesView = (props) => {
    const serverURL = window.serverURL;

    const [sentences, setSentences] = useState([]);
    const [pageSize, setPageSize] = useState(null);
    const [curPage, setCurPage] = useState(null)
    const [numberOfPages, setNumberOfPages] = useState(null);

    const docId = props.docId;

    useEffect(() => {
            axios.get(serverURL.concat("/document_sentences"),
                {
                    params: {
                        docId: docId
                    }
                }
            ).then(response => {
                setSentences(response.data.sentences);
                let numOfSentences = response.data.sentences.length;
                setPageSize(response.data.pageSize);
                setNumberOfPages(Math.ceil(numOfSentences/response.data.pageSize));
                setCurPage(1);
            }).catch(err => {
                    console.log(err.message);
                    props.onErrorProp(err);
                }
            );
        },
        []
    );

    const search = (sentenceId) => {
        props.chooseSearchViewProps(docId, sentenceId);
    }

    const goNextPage = () => {
        if (curPage < numberOfPages){
            setCurPage(curPage + 1);
        }
    };

    const goPrevPage = () => {
        if (curPage > 1){
            setCurPage(curPage - 1);
        }
    };

    return (
        <section>
            {sentences.slice((curPage - 1) * pageSize, curPage * pageSize).map(item => {
                return <SentenceItem key={item.id} sentence={item} searchProps={search}/>
            })}
            <div className="page-numbering">
                    <button onClick={goPrevPage}>&lt;</button>
                    <span className="page-number">page {curPage} of {numberOfPages}</span>
                    <button onClick={goNextPage}>&gt;</button>

            </div>
        </section>
    );
}

export default SentencesView;