import React, { Component } from 'react';
import NavBar from '../Components/NavBar';
import Books from '../Components/Books';

class App extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <div style={{ paddingTop: 50 }}>
                    <Books />
                </div>
            </div>
        );
    }
}

export default App;