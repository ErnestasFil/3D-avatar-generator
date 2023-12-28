import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link, Redirect } from 'react-router-dom';
import Home from './Home';
import Test from './Test';
export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/test" element={<Test />} />
                </Routes>
            </Router>
        );
    }
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
