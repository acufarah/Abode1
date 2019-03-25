import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import FileUpload from './fileupload';
import { generateData} from '../utils/Form/formActions';
import { listNewItem } from './../actions/item_actions';
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';

class NewListing extends Component{

    state=  {
                formError: false,
                formSuccess: '',
                formdata:{
                        itemName: '',
                        itemType: '',
                        availDate: '',
                        description: '',
                        imgURL: '',
                        images:{
                            value: []
                        }
                    }
            }
    
    
  
    onChange= (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit= (e) =>{
        e.preventDefault();
  
        let dataToSubmit= generateData(this.state.formdata,'newListing');
        const { history } = this.props;
  
        this.props.dispatch(listNewItem(dataToSubmit)).then(response =>{
            if(response.payload){
                console.log(response.payload);
                this.setState({
                    formError: false,
                    formSuccess: true
                });
                setTimeout(()=>{
                    history.push('/dashboard');
                }, 3000)
            }
            else{
                this.setState({
                    formError: true
                })
            }
        }).catch(e=>{
                this.setState({
                    formError: true
                })
        })
    }


    imagesHandler = ()=>{

    }


    render() {
    
      return (
        <div>
            <center>
          <div className='row'>
              <div className='col-md-6'>
                  <Link to="/" className='btn btn-link'>
                      <i className='fas fa-arrow-circle-left'/>
                      {' '}Back to Dashboard
                  </Link>
                  
              </div>
          </div>
          <div className = "row"></div>
                <div className='col-md-6 mx-auto'>
                    <h2 className="text-center">Add New Listing</h2>
                <center>
                    <div className="card shadow p-3 mb-5 bg-white rounded">
                    
                        <div className="card-body">
                            
                    
                                
                                    <div className='form-group row justify-content-center align-items-center'>
        
                  <form onSubmit={this.onSubmit}>
                      <div className= 'form-group'>
                       <FileUpload
                          imagesHandler = {(images)=> this.imagesHandler(images)}
                          reset = {this.state.formSuccess}
                        />

                      </div>
                      <div className='form-group'>
                          <label htmlFor='itemName'><h4>Item Name</h4></label>
                          <input type='text' 
                                 className='form-control' 
                                 name='itemName'
                                
                                 minLength='2'
                                 required
                                 onChange={this.onChange}
                                 value={this.state.itemName}
                          />
                      </div>
                      <div className = 'form-group'>
                      <label htmlFor= 'itemType'><h4>Item Type</h4></label>
                      <select name="itemType"
                            className='form-control'
                            required
                            onChange={this.onChange}
                            value={this.state.itemType}>
                        <option value="1">Housewares</option>
                        <option value="2">Furniture</option>
                      </select>
                      </div>
                      <div className='form-group'>
                          <label htmlFor='description'><h4>Item Description</h4></label>
                          <textarea
                                 rows= "4"
                                 cols= "50"
                                 className='form-control'
                                 name='description'
                                 placeholder='Describe condition, appearance, usability, etc.'
                                 onChange={this.onChange}
                                 value={this.state.description}
                          />
                      </div>
                    
                      <input type='submit' value='Submit' className='btn btn-primary btn-block'/>
                  </form>
            
                </div>
        
        
                            
            </div>
        </div>
        </center>
    </div>
    </center>
    </div>
      )
    }
  }

export default connect()(withRouter(NewListing));