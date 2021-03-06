import React,{useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addPost} from '../../actions/post'
import {setAlert} from '../../actions/alert'

const PostForm = ({addPost,setAlert}) => {
    const [text,setText] =useState(' ') ;
    return (
        <div className="post-form">
        <div className="bg-dark p border-rad">
          <h3>Say Something...</h3>
        </div>
        <form className="form my-1" onSubmit={e =>{
            e.preventDefault();
           {
             text.trim() !="" ? addPost({text}): setAlert('Please enter a string');
           } 
            setText('');
        }}>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
    )
}

PostForm.propTypes = {
addPost:PropTypes.func.isRequired,
setAlert: PropTypes.func.isRequired,
}

export default connect(null,{addPost,setAlert})(PostForm) ;
