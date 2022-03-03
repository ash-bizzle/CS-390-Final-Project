import React from "react";
import './App.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: undefined, click: 0, error: undefined, success: undefined, updating: undefined };
    axios.defaults.headers.common["access-token"] = localStorage.getItem('access-token');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.insertToInput = this.insertToInput.bind(this);
    this.logout = this.logout.bind(this);
    this.idRef = React.createRef();
    this.nameRef = React.createRef();
    this.yearRef = React.createRef();
    this.genreRef = React.createRef();
    this.timeRef = React.createRef();
  }

  logout(event) {
    event.preventDefault();
    localStorage.removeItem("access-token");
    this.props.history.push("/login");
  }

  handleSubmit(event) {
    this.setState({error: undefined});
    if (this.state.click === 0) {
      this.addMovie(event);
    } else if (this.state.click === 1) {
      this.updateMovie(event);
    }
    this.idRef.current.value = "";
    this.setState({updating: undefined})
    this.setState({click: 0});
  }

  getMovies() {
    axios.get("http://localhost:3001/api/movies/")
    .then(res => {
      this.setState({ movies: res.data.movies });
    })
    .catch(err => {
      this.props.history.push("/login");
    });
  }

  updateMovie(event) {
    event.preventDefault();
    var id = event.target.id.value;
    var name = event.target.name.value;
    var runningTime = event.target.time.value;
    var releaseYear = event.target.year.value;
    var genre = event.target.genre.value;
    if (id === "") {
      this.setState({error: "Please select a Movie to Update", success: undefined});
      return;
    }

    if (genre === "Default") {
      this.setState({error: "Please select a Genre", success: undefined});
      return;
    }

    axios.put("http://localhost:3001/api/movies/"+id, {
      name: name,
      time: runningTime,
      year: releaseYear,
      genre: genre 
    })
    .then(res => {
      if (res.status === 200) {
        event.target.name.value = "";
        event.target.time.value = "";
        event.target.year.value = "";
        event.target.genre.value = "Default";
        this.setState({error: undefined, success: "Movie Updated Successfully"});
        this.getMovies();
      }
    })
    .catch(err => {
      this.setState({error: "Some Unknown Error Occured", success: undefined});
    });
  }

  addMovie(event) {
    event.preventDefault();
    var name = event.target.name.value;
    var runningTime = event.target.time.value;
    var releaseYear = event.target.year.value;
    var genre = event.target.genre.value;
    if (genre === "Default") {
      this.setState({error: "Please select a Genre", success: undefined});
      return;
    }
    axios.post("http://localhost:3001/api/movies/", {
      name: name,
      runningTime: runningTime,
      releaseYear: releaseYear,
      genre: genre
    })
    .then(res => {
      if (res.status === 200) {
        event.target.name.value = "";
        event.target.time.value = "";
        event.target.year.value = "";
        event.target.genre.value = "Default";
        this.setState({error: undefined, success: "Movie Added Successfully"});
        this.getMovies();
      }
    })
    .catch(err => {
      if (err.response.status === 403) {
        this.setState({error: "Movie Already Exists", success: undefined});
      } else {
        this.setState({error: "Some Unknown Error Occured", success: undefined});
      }
    });
  }

  deleteMovie(id) {
    axios.delete("http://localhost:3001/api/movies/"+id)
    .then(res => {
      if (res.status === 200) {
        this.setState({error: undefined, success: "Movie Deleted Successfully"});
        this.getMovies();
      }
    })
    .catch(err => {
      this.setState({error: "Some Unknown Error Occured", success: undefined});
    });
  }

  insertToInput(id, name, runningTime, releaseYear, genre, index) {
    this.idRef.current.value = id;
    this.nameRef.current.value = name;
    this.timeRef.current.value = runningTime;
    this.yearRef.current.value = releaseYear;
    this.genreRef.current.value = genre;
    this.setState({updating: "Movie " + (index + 1) + " Selected", success: undefined, error: undefined})
    return;
  }

  clearUpdate(event) {
    this.idRef.current.value = "";
    this.nameRef.current.value = "";
    this.timeRef.current.value = "";
    this.yearRef.current.value = "";
    this.genreRef.current.value = "Default";
    this.setState({updating: undefined})
    event.preventDefault();
  }

  componentWillMount() {
    this.getMovies();
  }

  render() {

    var movieList = undefined;

    if (this.state.movies) {
      movieList = this.state.movies.map((movie, index) => 
      <div key={movie._id} className="movie-profile">
      <span name="name" className="movie-name">
        {movie.name}
        <span className="movie-info">Genre: <span name="genre">{movie.genre}</span></span>
        <span className="movie-info">Release Year: <span name="year">{movie.releaseYear}</span></span>
        <span className="movie-info">Running Time: <span name="time">{movie.runningTime}m</span></span>
      </span>
      <span className="movie-btn-parent">
        <button className="movie-btn"onClick={(e) => this.insertToInput(movie._id, movie.name, movie.runningTime, movie.releaseYear, movie.genre, index)}>
          Update
        </button>
        <button className="movie-btn" onClick={(e) => this.deleteMovie(movie._id)}>Delete</button>
      </span>
      </div>
      )
    }

    return (
      <div className="App">
      <article className="board">
        <header>
          <button className="board-logout" onClick={this.logout}>Logout</button>
          <h1 className="board-title">
            <span className="board-title-top">My Movies</span>
            <span className="board-title-bottom">Favorites List</span>
          </h1>
        </header>
        <form className="movie-input-parent" onSubmit={this.handleSubmit}>
          <input name="id" ref={this.idRef} defaultValue="" hidden/>
          <ul className="movie-input"> 
            { 
              this.state.updating &&
              <li>
                <input className="movie-update" value={this.state.updating} disabled align="center"/>
              </li>
            }
            { 
              this.state.success &&
              <li>
                <input className="movie-success" value={this.state.success} disabled align="center"/>
              </li>
            }
            { 
              this.state.error &&
              <li>
                <input className="movie-error" value={this.state.error} disabled align="center"/>
              </li>
            }
            <li><input name="name" ref={this.nameRef} type="text" align="center" required placeholder="Movie Name"/></li>
            <li><input name="year" ref={this.yearRef} type="number" min="1900" max="2030" step="1" align="center" required placeholder="Release Year"/></li>
            <li>
              <select name="genre" ref={this.genreRef} defaultValue="Default" required placeholder="Genre">
                <option disabled value="Default"> Select a Genre</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Crime">Crime</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="SciFi">SciFi</option>
                <option value="Thriller">Thriller</option>
              </select>
              <input name="time" ref={this.timeRef} type="number" min="30" max="360" step="1" align="center" required placeholder="Running Time (in min)"/>
            </li>
            <li>
              <button className="submit-btn" align="center" onClick={(e) => this.setState({click: 0})}>Add To Favorites</button>
              <button className="submit-btn" align="center" onClick={(e) => this.setState({click: 1})}>Update In Favorites</button>
              <button className="submit-btn" align="center" onClick={(e) => this.clearUpdate(e)}>Clear Update</button>
            </li>
          </ul>
        </form>     
        <div className="movie-profiles">
          {movieList}
        </div>
      </article>
      </div>
    );
  }
}

export default withRouter(App);
