import React, { useRef, useEffect, useState } from 'react';
import Table from "./Table"
import axios from 'axios';

import "./app.css"
import Animation from "./Animation"
export default function App() {
    const [loading, setLoading] = React.useState(false)
    const api = "https://api.github.com/repos/neovim/neovim/pulls?state=all"
    const [data, setData] = React.useState([])
    
    const [prevY, setPrevY] = useState(0);
    const [page, setPage] = useState(1);
    let photosRef = useRef({});
    let loadingRef = useRef(null);
    let prevYRef = useRef({});
    let pageRef = useRef({});
    photosRef.current = data;
    pageRef.current = page;
    prevYRef.current = prevY;
    useEffect(() => {
        getData();
        setPage(pageRef.current + 1);

        let options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        };

        const observer = new IntersectionObserver(handleObserver, options);
        observer.observe(loadingRef.current);
    }, []);

    const handleObserver = (entities, observer) => {
        console.log("time to get more photos");

        const y = entities[0].boundingClientRect.y;

        if (prevYRef.current > y) {
            console.log("actually getting photos.");
            getData()
            setPage(pageRef.current + 1);
        } else {
            console.log("conditional is false");
        }
        console.log("currenty: ", y, "prevY: ", prevY);
        setPrevY(y);
    };

    async function getData() {
        try {
            let res = await axios.get(
                `${api}&page=${pageRef.current}&per_page=10`
            );
            let data = res.data
            if (data) {
                const mappedData = data.map(d => {
                    const title = d.title
                    const baseBranch = d.base.ref
                    const authorBranch = d.base
                    const author = d.user.login
                    const pullUrl = d.html_url
                    let createdOn = d.created_at
                    createdOn = new Date(d.created_at)
                    let avatar = d.user.avatar_url
                    let [, month, day, year] = createdOn.toString().split(' ')
                    createdOn = `${day}-${month}-${year}`
                    const reviewers = d.requested_reviewers
                    const labels = d.labels
                    return { title, baseBranch, author, authorBranch, author, createdOn, reviewers, labels, avatar, pullUrl }
                })
                setData([...photosRef.current, ...mappedData]);
            }
        } catch (error) {
            console.log("ERROR GETTING PHOTOS", error);
        }
    }

    // React.useEffect(() => {

    //     let cancel

    //     axios({
    //         method: 'GET',
    //         url: api,
    //         params: { page: pg, per_page: 15 },
    //         cancelToken: new axios.CancelToken(c => cancel = c)
    //     }).then(res => {
    //         const data = res.data
    //         console.log(data)
    //         const mappedData = data.map(d => {
    //             const title = d.title
    //             const baseBranch = d.base.ref
    //             const authorBranch = d.base
    //             const author = d.user.login
    //             const pullUrl = d.html_url
    //             let createdOn = d.created_at
    //             createdOn = new Date(d.created_at)
    //             let avatar = d.user.avatar_url
    //             let [, month, day, year] = createdOn.toString().split(' ')
    //             createdOn = `${day}-${month}-${year}`
    //             const reviewers = d.requested_reviewers
    //             const labels = d.labels
    //             return { title, baseBranch, author, authorBranch, author, createdOn, reviewers, labels, avatar, pullUrl }
    //         })
    //         // console.log(mappedData)
    //         setData(mappedData)
    //     }).catch(e => {

    //     })




    // }, [pg])
    return <div className='app'>
        <h1>Table</h1>
        {data.length == 0 ? <Animation /> : <div> <Table data={data} />
        </div>
        }
        <div ref={loadingRef} style={{ height: "20px", width: "20px" }}>
        </div>
        <span style={{ display: loading ? "block" : "none" }}>loading...</span>


    </div>
}