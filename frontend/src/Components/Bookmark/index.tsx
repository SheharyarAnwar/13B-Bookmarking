import React from "react"
import classes from "./index.module.css"
import LinkIcon from "../../Assets/link.svg"
export interface BookmarkT {
  title: string
  link: string
}
const Index: React.FC<BookmarkT> = ({ title, link }) => {
  let parsedLink: string = link
  if (
    !link.includes("http://") ||
    !link.includes("https://") ||
    !link.includes("www.")
  ) {
    parsedLink = `http://${link}`
  }

  return (
    <div className={classes.root}>
      <p>{title}</p>

      <a className={classes.check} href={parsedLink} target="__blank">
        <LinkIcon width={20} />
      </a>
    </div>
  )
}

export default Index
