import React from "react";
import API, { booksPath, editBookPath, addBookPath, deleteBookPath, categoryPath } from "../Api/NetworkHandler";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const booksColumnData = [
    {
        id: 'id', label: 'Book Id',
    },
    {
        id: 'book_title', label: 'Title',
    },
    {
        id: 'author', label: 'Author',
    },
    {
        id: 'language', label: 'Language',
    },
    {
        id: 'price', label: 'Price',
    },
    {
        id: 'category', label: 'category',
    },
    {
        id: 'action', label: 'Action',
    },
];

const style = {
    modalStyle: {
        marginLeft: 20
    },
    paperStyle: {
        position: 'absolute',
        border: '2px solid #000',
        boxShadow: 3,
        padding: (20, 40, 30),
        width: '35%',
        marginLeft: '32%',
        marginTop: '15%'
    }
}
class Books extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            isOpen: false,
            book: {},
            categories: [],
            id: null,
            title: '',
            author: '',
            language: '',
            price: '',
            categoryId: '',
            category: {}
        }
    }

    fetchBooks = async () => {
        const response = await API.sendRequest('get', booksPath);
        const { data = [] } = response;
        this.setState({
            books: data,
        });
    }

    fetchCategory = async () => {
        const response = await API.sendRequest('get', categoryPath);
        const { data = [] } = response;
        this.setState({
            categories: data,
        });
    }

    removeBook = async (id) => {
        await API.sendRequest('delete', deleteBookPath(id));
        this.fetchBooks();
    }

    editBook = (book) => {
        const { category } = book;
        this.setState({
            isOpen: true,
            book,
            category
        });
    }

    handleClose = () => {
        this.setState({
            isOpen: false,
        });
    }

    handleChange = (event) => {
        this.setState({
            categoryId: event.target.value,
        })
    }

    onSubmit = async () => {
        const { book } = this.state;
        const { title, author, language, price, categoryId, category } = this.state;
        const body = {
            id: book.id ? book.id : null,
            title: title ? title : book.title,
            author: author ? author : book.author,
            language: language ? language : book.language,
            price: price ? price : book.price,
            category: {
                id: categoryId ? categoryId : category.id
            }
        }
        if (body.id != null) {
            await API.sendRequest('put', editBookPath(book.id), body);
        }
        else {
            await API.sendRequest('post', addBookPath, body);
        }
        this.setState({
            isOpen: false,
        }, () => this.fetchBooks());
    }

    handleTitle = (event) => this.setState({ title: event.target.value });
    handleAuthor = (event) => this.setState({ author: event.target.value });
    handleLanguage = (event) => this.setState({ language: event.target.value });
    handlePrice = (event) => this.setState({ price: event.target.value });

    createBook = () => this.setState({
        isOpen: true,
        book: {},
    });

    componentDidMount() {
        this.fetchBooks();
        this.fetchCategory();
    }

    render() {
        const { book, categories } = this.state;
        return (
            <div>
                <Button
                    variant="contained" color="secondary" onClick={this.createBook}
                >Create Book</Button>
                <br /><br />
                <Paper elevation="2">
                    <Table>
                        <TableHead  >
                            <TableRow style={{ background: 'black', fontWeight: 'bold' }} >
                                {booksColumnData.map((row, key) => (
                                    <TableCell style={{ color: 'white' }} key={key}>{row.label.toUpperCase()}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.books.map((row, key) => (
                                <TableRow hover key={row.id}>
                                    <TableCell >{++key}</TableCell>
                                    <TableCell >{row.title}</TableCell>
                                    <TableCell >{row.author}</TableCell>
                                    <TableCell>{row.language}</TableCell>
                                    <TableCell>{row.price}</TableCell>
                                    <TableCell>{row.category.name}</TableCell>
                                    <TableCell><EditIcon onClick={() => this.editBook(row)} style={{ paddingRight: 30 }} />
                                        <DeleteIcon onClick={() => this.removeBook(row.id)} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <Modal
                    open={this.state.isOpen}
                    onClose={this.handleClose}

                >
                    <Paper elevation="3" style={style.paperStyle}>
                        <form>
                            <h3>Create / Edit Book</h3>
                            <TextField
                                id="title"
                                label="Title"
                                margin="normal"
                                defaultValue={book.title}
                                onChange={this.handleTitle}
                                required
                                error={this.state.title.length > 0 ? false : true}
                            />
                            <TextField
                                id="author"
                                style={style.modalStyle}
                                label="Author"
                                defaultValue={book.author}
                                margin="normal"
                                onChange={this.handleAuthor}
                                required
                                error={this.state.author.length > 0 ? false : true}
                            />
                            <TextField
                                id="language"
                                label="Language"
                                defaultValue={book.language}
                                margin="normal"
                                onChange={this.handleLanguage}
                                required
                                error={this.state.language.length > 2 ? false : true}
                            />
                            <TextField
                                id="Price"
                                label="Price"
                                type="number"
                                style={style.modalStyle}
                                defaultValue={book.price}
                                margin="normal"
                                onChange={this.handlePrice}
                            />
                            <InputLabel >Category </InputLabel>
                            <Select
                                name="Category"
                                value={{
                                    id: 1,
                                    name: '34'
                                }}
                                placeholder="select category"
                                style={{ width: 200 }}
                                onChange={this.handleChange}
                            >
                                {categories.map((row, index) => (
                                    <MenuItem key={index}
                                        value={row.id}>{row.name}</MenuItem>))}
                            </Select>
                            <Button variant="contained" color="primary" style={style.modalStyle}
                                onClick={this.onSubmit}>
                                SUBMIT
                            </Button>
                        </form>
                    </Paper>
                </Modal>
                <ToastContainer
                    position="top-right"
                    newestOnTop={true}
                    rtl={false}
                />
            </div >
        );
    }
}

export default Books;