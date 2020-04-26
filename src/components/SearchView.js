import React, {useState, useEffect} from "react";
import axios from "axios";
import Loader from 'react-loader-spinner'
import SearchItem from "./SearchItem";

const SearchView = (props) => {
    const serverURL = window.serverURL;

    const [sentences, setSentences] = useState([])
    const [pageSize, setPageSize] = useState(null);
    const [curPage, setCurPage] = useState(null)
    const [numberOfPages, setNumberOfPages] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(
        () => {
            setLoading(true);
            axios.get(
                serverURL.concat("/search"),
                {params: {docId: props.docId, sentenceId: props.sentenceId}}
            ).then(
                response => {
                    setSentences(response.data.sentences)
                    let numOfSentences = response.data.sentences.length;
                    setPageSize(response.data.pageSize);
                    setNumberOfPages(Math.ceil(numOfSentences / response.data.pageSize));
                    setCurPage(1);
                    setLoading(false);
                }
            ).catch(err => {
                console.log(err.message);
                props.onErrorProp(err);
            })
        },
        []
    )

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

    return (
        <section>
            <div style={{display: loading ? "block" : "none"}}>
                <Loader
                    type="ThreeDots"
                    color="#00BFFF"
                    height={100}
                    width={100}
                />
            </div>
            {sentences.slice((curPage - 1) * pageSize, curPage * pageSize).map(
                (item) => {
                    return (<SearchItem key={item.id} sentence={item} chooseTextView={props.chooseTextView}/>)
                }
            )}
            <div className="page-numbering">
                <button onClick={goPrevPage}>&lt;</button>
                <span className="page-number">page {curPage} of {numberOfPages}</span>
                <button onClick={goNextPage}>&gt;</button>

            </div>
        </section>
    )
}

export default SearchView;
