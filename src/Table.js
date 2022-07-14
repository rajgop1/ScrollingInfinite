import React from 'react';
import "./table.css"
import { BiGitPullRequest } from "react-icons/bi"
import { VscExpandAll, VscCollapseAll } from "react-icons/vsc"
export default function Table({ data }) {
    const [show, setShow] = React.useState({
        id: null,
        show: false
    })
    return <div className="table">
        <div className="heading">
            <div>Author</div>
            <div>Author Branch</div>
            <div>Base Branch</div>
            <div>Created On</div>
            
        </div>
        <div className='details'>
            {
                data.map((d, index) => {
                    return <div key={index} className="detail-container">
                        <h2>Title: <span className='regular'>{d.title}</span></h2>
                        <div className="detail-item">
                            <div className="detail-subitem-left">
                                <div className="detail-item-img"><img src={`${d.avatar}`} width={50} /></div>
                                <div>{d.author}</div>
                                <div>{d.author}</div>
                                <div>{d.baseBranch}</div>
                                <div>{d.createdOn}</div>
                                <a href={`${d.pullUrl}`} title="Goto Pull request" target="_blank"><BiGitPullRequest style={{ fontSize: "20px", color: "black" }} /></a>
                            </div>
                            <div className="detail-subitem-right">
                                {show.id != index && <VscExpandAll onClick={() => setShow({ id: index, show: true })} title="more details" style={{ fontSize: "20px", color: "black", cursor: "pointer" }} />}
                                {show.id == index && show.show && <VscCollapseAll onClick={() => setShow({ id: null, show: false })} title="hide details" style={{ fontSize: "20px", color: "black", cursor: "pointer" }} />}
                            </div>
                        </div>
                        <div>
                            {show.id == index && show.show && <div>
                                <div><h3>Review:</h3></div>{d.reviewers.length > 0 ? d.reviewers.map((review, reviewIndex) => {
                                    return <div key={index.toString() + reviewIndex.toString()}>{review.login}</div>
                                }) : <div>No Reviews</div>}

                            </div>}
                        </div>
                    </div>
                })
            }
        </div>
    </div >
}