import React, {Component} from 'react';
import { connect } from 'react-redux';
import FormField from '../utils/Form/formfield';
import { update, generateData, isFormValid } from '../utils/Form/formActions';
import { registerUser } from './../actions/user_actions';
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';

class Register extends Component{

    state = {
        formError: false,
        formSuccess: false,
        formdata:{
            firstName:{
                element: 'input',
                value: '',
                config: {
                    name: 'name_input',
                    type: 'text',
                    placeholder: 'Enter your first name'
                },
                validation: {
                    required: true
                   
                    
                },
                valid: false,
                touched: false,
                validationMessage: '' 
            },
            lastName:{
                element: 'input',
                value: '',
                config: {
                    name: 'lastname_input',
                    type: 'text',
                    placeholder: 'Enter your last name'
                },
                validation: {
                    required: true
                   
                    
                },
                valid: false,
                touched: false,
                validationMessage: '' 
            },
            email:{
                element: 'input',
                value: '',
                config: {
                    name: 'email_input',
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                validation: {
                    required: true,
                    email: true
                    
                },
                valid: false,
                touched: false,
                validationMessage: '' 
            },
            password:{
                element: 'input',
                value: '',
                config: {
                    name: 'password_input',
                    type: 'password',
                    placeholder: 'Enter your password'
                },
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage: '' 
            },
            confirmPassword:{
                element: 'input',
                value: '',
                config: {
                    name: 'confirm_password_input',
                    type: 'password',
                    placeholder: 'Confirm your password'
                },
                validation: {
                    required: true,
                    confirm: 'password'
                },
                valid: false,
                touched: false,
                validationMessage: '' 
            }
            
    }
}
updateForm= (element)=>{
    const newFormdata= update(element, this.state.formdata,'register')
    this.setState({
        formError: false,
        formdata: newFormdata
    })
}


submitForm=(event)=>{
    event.preventDefault();

    let dataToSubmit= generateData(this.state.formdata,'register');
    let formIsValid= isFormValid(this.state.formdata,'register');

    if(formIsValid){
        //console.log(dataToSubmit);
        this.props.dispatch(registerUser(dataToSubmit)).then(response =>{
            if(response.payload){
                console.log(response.payload);
                this.setState({
                    formError: false,
                    formSuccess: true
                });
                setTimeout(()=>{
                    this.props.history.push('/login');
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
    }else{
        this.setState({
            formError: true
        })
    }

}

    render(){
        return(
            <div className = "row">
                <div className='col-md-6 mx-auto'>
                    <h2 className="text-center">Sign Up Form</h2>
                    <center>
                    <div className="card shadow p-3 mb-5 bg-white rounded">
                    
                        <div className="card-body">
                            
                    
                                <div className="form-group">
                                    <div className="form-group row justify-content-center align-items-center ">
                                     
                                            
                                                <form onSubmit={(event)=>this.submitForm(event)}>
                                            
                                                    <h2>Personal Information</h2>
                                                    
                                                      
                                                            <FormField
                                                                id={'firstName'}
                                                                formdata={this.state.formdata.firstName}
                                                                change={(element)=> this.updateForm(element)}
                                                            />
                                                        
                                                       
                                                            <FormField
                                                                id={'lastName'}
                                                                formdata={this.state.formdata.lastName}
                                                                change={(element)=> this.updateForm(element)}
                                                            />
                                                        
                                                      
                                                        
                                                            <FormField
                                                                id={'email'}
                                                                formdata={this.state.formdata.email}
                                                                change={(element)=> this.updateForm(element)}
                                                            />
                                                      
                                                        <h2>Verify Password</h2>
                                                           
                                                                <FormField
                                                                    id={'password'}
                                                                    formdata={this.state.formdata.password}
                                                                    change={(element)=> this.updateForm(element)}
                                                                />
                                                         
                                                            
                                                                <FormField
                                                                    id={'confirmPassword'}
                                                                    formdata={this.state.formdata.confirmPassword}
                                                                    change={(element)=> this.updateForm(element)}
                                                                />
                                                            
                                                    
                                                        <div>
                                                            {this.state.formError===true ?
                                                            <div className="error_label">
                                                                Please check your data.
                                                            </div>
                                                            : null}
                                                            <input
                                                                type='submit'
                                                                value='Register'
                                                                className='btn btn-primary btn-block'
                                                                onClick= {(event)=>this.submitForm(event)}
                                                            />
                                                        </div>
                                                   
                                                </form>
                                            
                                              
                                       
                                    </div>
                                </div>
                            
                        </div>
                    
                            <Dialog open={this.state.formSuccess}>
                                <div>
                                You will be redirected to the LOGIN in a couple of seconds...
                                </div>
                        
                            </Dialog>
                       
                    </div>
                    </center>
                </div>
            </div>
        );
    }
}

export default connect()(withRouter(Register));