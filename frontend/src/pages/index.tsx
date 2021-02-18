import React, { useEffect, useState } from "react"
import classes from "./index.module.css"
import Add from "../Assets/Add.svg"
import Bookmark, { BookmarkT } from "../Components/Bookmark"
import { useQuery, useMutation } from "@apollo/client"
import { ADD_BOOKMARK, GET_BOOKMARKS } from "../Apollo/queries"
const Home = () => {
  const wrapperRef = React.createRef<HTMLDivElement>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [data, setData] = useState<BookmarkT[]>([])
  const [title, setTitle] = useState<string>("")
  const [link, setLink] = useState<string>("")
  const [
    addBookmark,
    { loading: mutationLoading, data: mutationData, error: mutationError },
  ] = useMutation(ADD_BOOKMARK)
  const { data: qData, error: qError, loading: qLoading } = useQuery(
    GET_BOOKMARKS
  )
  useEffect(() => {
    qData && setData(qData.bookmarks)
  }, [qData])
  useEffect(() => {
    mutationData && setData(prev => [mutationData.addBookmark, ...prev])
    console.log(mutationData)
  }, [mutationData])

  const onTaskAddedHandler = () => {
    setModalOpen(false)
    addBookmark({ variables: { title, link } })
    setTitle("")
    setLink("")
  }
  const tasks = data.map((val, i) => <Bookmark key={i} {...val} />)
  return (
    <>
      <div className={classes.header}>
        <h3>Bookmarking App</h3>
      </div>

      <div className={classes.root}>
        <div className={classes.tasks}>
          {qLoading || mutationLoading ? (
            <p style={{ textAlign: "center" }}>Loading . . .</p>
          ) : tasks && tasks.length <= 0 ? (
            <p style={{ marginTop: "10%", textAlign: "center" }}>
              No Bookmarks To Show
            </p>
          ) : (
            tasks
          )}
        </div>
        <div className={classes.add} onClick={() => setModalOpen(true)}>
          <Add width={15} />
        </div>
      </div>
      <div
        style={{ display: modalOpen ? "flex" : "none" }}
        className={classes.modalWrapper}
        ref={wrapperRef}
        onClick={e => {
          wrapperRef.current === (e.target as Node) && setModalOpen(false)
        }}
      >
        <div className={classes.modal}>
          <h4>Add Bookmark</h4>
          <h5>Title</h5>
          <input
            placeholder="Click To Add Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
          ></input>
          <h5>Link</h5>
          <input
            placeholder="Link (e.g xxxx.com)"
            value={link}
            onChange={e => setLink(e.target.value)}
            type="text"
          ></input>
          <button className={classes.add} onClick={() => onTaskAddedHandler()}>
            <Add width={15} />
          </button>
        </div>
      </div>
    </>
  )
}

export default Home
