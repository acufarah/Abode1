import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormField from '../utils/Form/formfield';
import { update, generateData, isFormValid } from '../utils/Form/formActions';
import { loginUser } from './../actions/user_actions';
import { withRouter } from 'react-router-dom';

class Login extends Component{

    state= {
        formError: false,
        formSuccess: '',
        formdata:{
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
            }
        }
    }

    updateForm= (element)=>{
        const newFormdata= update(element, this.state.formdata,'login')
        this.setState({
            formError: false,
            formdata: newFormdata
        })
    }

    submitForm=(event)=>{
        event.preventDefault();

        let dataToSubmit= generateData(this.state.formdata,'login');
        let formIsValid= isFormValid(this.state.formdata,'login');

        if(formIsValid){
            this.props.dispatch(loginUser(dataToSubmit)).then(response =>{
                if(response.payload.loginSuccess){
                    console.log(response.payload);
                    this.props.history.push('/user/dashboard')
                }
                else{
                    this.setState({
                        formError: true
                    })
                }
            });
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
                    <h2 className="text-center">Login</h2>
                    <center>
                    <div className="card shadow p-3 mb-5 bg-white rounded">
                    
                        <div className="card-body">
                            
                    
                                <div className="form-group">
                                    <div className="form-group row justify-content-center align-items-center ">
                                     
                                            
                                                <form onSubmit={(event)=>this.submitForm(event)}>
                                                    <FormField
                                                        id={'email'}
                                                        formdata={this.state.formdata.email}
                                                        change={(element)=> this.updateForm(element)}
                                                    />
                                                    <FormField
                                                        id={'password'}
                                                        formdata={this.state.formdata.password}
                                                        change={(element)=> this.updateForm(element)}
                                                    />
                                                    {this.state.formError ?
                                                        <div className="error_label">
                                                        Please check your data.
                                                        </div>
                                                    : null}

                                                    <input
                                                        type='submit'
                                                        value='Login'
                                                        className='btn btn-primary btn-block'
                                                        onClick= {(event)=>this.submitForm(event)}
                                                    />
                                                </form>
                                    </div>
                                </div>
                            
                        </div>
                    </div>
                </center>
                </div>
            </div>
                                                        
        );
    }
}

export default connect()(withRouter(Login));