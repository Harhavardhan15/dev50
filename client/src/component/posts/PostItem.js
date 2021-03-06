import React,{Fragment} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import Moment from 'react-moment'
import {connect} from 'react-redux'
import {addLike,removeLike,deletePost} from '../../actions/post'

const PostItem = ({auth,addLike,removeLike,deletePost,post:{_id,text,name,avatar,user,likes,comments,date},showActions}) => {
    return (
        <div className="post bg-card p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img
              className="round-img"
              src={avatar} 
              alt=""
            />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1 post-heading">
         {text}
          </p>
           <p className="post-date">
              Posted on<Moment format="DD/MM/YYYY">{date}</Moment> 
          </p>
          {showActions && <Fragment>
            <button type="button" className="btn btn-like" onClick={(e) => addLike(_id) }>
            <i className="fas fa-thumbs-up"></i> {' '}
            {likes.length >0 && (
 <span>{likes.length}</span>
            )}
           
          </button>
          <button  onClick={(e) => removeLike(_id) } type="button" className="btn btn-like">
            <i className="fas fa-thumbs-down"></i>
          </button>
          <Link to={`/post/${_id}`}  className="btn btn-like">
          <i className="fas fa-comments"></i> {' '} {comments.length > 0  && (
                <span className=''>{comments.length}</span>
            )} 
          </Link>
          {!auth.loading && user === auth.user._id && (
  <button      
  type="button"
  className="btn btn-delete"
  onClick={() => deletePost(_id)}
>
  <i className="fas fa-times"></i>
</button> )}
              </Fragment>}
 
         
        
        </div>
      </div>
    )
}
PostItem.defaultProps = {
    showActions:true
}
PostItem.propTypes = {
auth:PropTypes.object.isRequired,
post:PropTypes.object.isRequired,
addLike:PropTypes.func.isRequired,
removeLike:PropTypes.func.isRequired,
deletePost: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps,{addLike,removeLike,deletePost})(PostItem)
