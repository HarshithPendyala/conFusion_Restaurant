import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle,Breadcrumb,BreadcrumbItem, ModalBody,Label, ModalHeader, Modal,Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import {LocalForm, Control, Errors} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger} from 'react-animation-components';

const required = (val) => val && val.length;
const minLength = (len) => (val) => val && (val.length >= len);
const maxLength = (len) => (val) => !(val) || (val.length <= len);
class CommentForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }
    toggleModal(){
        this.setState({
            isModalOpen : !this.state.isModalOpen
        });
    }
    handleComment(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }
     
    render() {
                return(
            <React.Fragment>
                <Button onClick={this.toggleModal} outline > <span className="fa fa-pencil fa-lg"></span> Comment</Button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                    Submit Comment
                </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={this.handleComment}>
                        <div className="form-group">
                            <Label htmlFor="rating">Rating</Label>
                            <Control.select model=".rating" id="rating" name="rating" className="form-control">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                        </div>
                        <div className="form-group">
                            <Label htmlFor="author">Your Name</Label>
                            <Control.text model=".author" id="author" className="form-control" placeholder="Your Name"
                            validators= {{
                               required ,minLength: minLength(2), maxLength:maxLength(15) }}
                            />
                            <Errors
                                className="text-danger" model=".author" show="touched"
                                messages= {{
                                    required: 'Required',
                                    minLength :' Must be greater than 2 characters',
                                    maxLength: ' Must be 15 characters or less'
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="comment">Comment</Label>
                            <Control.textarea model=".comment" className="form-control" id="comment" name="comment" rows="6"/>
                        </div>
                        <div className="form-group">
                            <Button type="submit" color="primary">Submit</Button>
                        </div>
                    </LocalForm>
                </ModalBody>
            </Modal>
            </React.Fragment>
            
        );
    }
}

    function RenderComments({comments,postComment, dishId}){
        if(comments != null){
            return(
                <div>
                    <ul className="list-unstyled">
                        <Stagger in>
                            {comments.map((comment) =>
                            {
                                return(
                                    <Fade in>
                                    <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                        <p>--{comment.author},{new Intl.DateTimeFormat('en-US',{ year:'numeric',month:'short',day:'2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                    </li>
                                    </Fade>                                                                   );
                            })}
                        </Stagger>                       
                    </ul> 
                    <CommentForm dishId={dishId}  postComment={postComment}/>   
                </div>
            );
        }
        else{
            return(<div></div>);
        }
    }
    function RenderDish({dish}){
            return (
                <FadeTransform in transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50)'
                }}>
                <Card>
                    <CardImg top src={baseUrl+dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
                </FadeTransform>
                
            ); 
    }

    const DishDetail=(props) => {
        if(props.isLoading){
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if(props.dish != null){
            return(
                <div className="container">
                    <div className="row">
                    <Breadcrumb>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr/>
                        </div>  
                    </div>                
                    <div className="row">
                        <div className="col-12 col-md-5">
                            <RenderDish dish={props.dish} />
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            <h4>Comments:</h4>
                            <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id} />
                        </div>
                    </div>
                </div>
            );       
        }
        else{
            return(
                <div>ERROR</div>
            );
        }

    }
    
export default DishDetail;