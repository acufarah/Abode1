import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
                        imgURL: ''
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
    render() {
    
      return (
        <div>
          <div className='row'>
              <div className='col-md-6'>
                  <Link to="/" className='btn btn-link'>
                      <i className='fas fa-arrow-circle-left'/>
                      {' '}Back to Dashboard
                  </Link>
              </div>
          </div>
          <div className='card'>
              <div className='card-header'>
              Add New Listing
              </div>
              <div className='card-body'>
                  <form onSubmit={this.onSubmit}>
                      <div className='form-group'>
                          <label htmlFor='itemName'>Item Name</label>
                          <input type='text' 
                                 className='form-control' 
                                 name='itemName'
                                 placeholder='item name'
                                 minLength='2'
                                 required
                                 onChange={this.onChange}
                                 value={this.state.itemName}
                          />
                      </div>
                      <div className = 'form-group'>
                      <label htmlFor= 'itemType'>Item Type</label>
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
                          <label htmlFor='description'>Item Description</label>
                          <input type='text' 
                                 className='form-control' 
                                 name='description'
                                 placeholder='Describe item: condition, appearance, usability, etc.'
                                 onChange={this.onChange}
                                 value={this.state.description}
                          />
                      </div>
                    
                      <input type='submit' value='Submit' className='btn btn-primary btn-block'/>
                  </form>
              </div> 
          </div>
        </div>
      )
    }
  }

export default connect()(withRouter(NewListing));