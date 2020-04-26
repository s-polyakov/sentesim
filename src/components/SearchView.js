import React, {useState, useEffect} from "react";
import axios from "axios";
import SearchItem from "./SearchItem";
import packageJson from '../../package.json'


const SearchView = (props) => {
    const serverURL = packageJson.serverURL;

    const [sentences, setSentences] = useState([])
    const [pageSize, setPageSize] = useState(null);
    const [curPage, setCurPage] = useState(null)
    const [numberOfPages, setNumberOfPages] = useState(null);

    useEffect(
        () => {
            axios.get(
                serverURL.concat("/search"),
                {params: {docId: props.docId, sentenceId: props.sentenceId}}
            ).then(
                response => {
                    setSentences(response.data.sentences)
                    let numOfSentences = response.data.sentences.length;
                    setPageSize(response.data.pageSize);
                    setNumberOfPages(Math.ceil(numOfSentences/response.data.pageSize));
                    setCurPage(1);
                }
            ).catch(err => {
                console.log(err.message);
                props.onErrorProp(err);
            })
        },
        []
    )

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
