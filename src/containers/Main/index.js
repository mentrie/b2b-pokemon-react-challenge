import React, { Component } from 'react';
import Nprogress from 'nprogress';
import ReactPlaceholder from 'react-placeholder';
import DetailModal from 'react-modal';
import 'nprogress/nprogress.css';
import 'react-placeholder/lib/reactPlaceholder.css';
import { apiRequest } from '../../api';
import { PAGE_SIZE } from '../../constants';
import PokemonList from './PokemonList';
import PokemanDetail from './PokemonDetail';
import SearchInput from './SearchInput';
import withRouter from 'react-router-dom/withRouter';

DetailModal.setAppElement('#root');
export class Main extends Component {
  state = {
    pokemons: [],
    error: '',
    search: '',
    isDetailModalOpen: false
  }

  handleSearch = ({target: {value}}) => {
    this.setState({search: value});
  }

  filterPokemon(pokemons) {
    // todo
  }

  handleSelect = () => this.setState(({isDetailModalOpen}) => ({isDetailModalOpen: !isDetailModalOpen}));

  async componentDidMount() {
    if (this.state.pokemons.length === 0) {
      Nprogress.start();
      try {
        const { results } = await apiRequest('/?limit=50');
        this.setState({pokemons: results});
      } catch (e) {
        this.setState({error: 'Something went wrong'});
      }
      Nprogress.done();
    }
  }

  goBack = () => {
    this.setState({isDetailModalOpen: false}, () => {
      this.props.history.push('/');
    });
  }

  render() {
    const { pokemons, search, isDetailModalOpen } = this.state;
    const displayPokemons = pokemons.slice(0, PAGE_SIZE);
    console.log(pokemons, 'what is');
    return (
      <main className="main">
        <ReactPlaceholder showLoadingAnimation type="media" rows={7} ready={pokemons.length > 0}>
          <SearchInput onChange={this.handleSearch} value={search} />
          {displayPokemons && displayPokemons.length
            ? <PokemonList pokemons={displayPokemons} onSelect={this.handleSelect} />
            : <div>No Pokemon found</div>
          }
        </ReactPlaceholder>
        <div className="main__pagination">
          <div className="pagination__prev">prev</div>
          <div className="pagination__currEnt">1</div>
          <span className="pagination__text">of 5</span>
          <div className="pagination__next">next</div>
        </div>
        <DetailModal
          isOpen={isDetailModalOpen}
          onRequestClose={this.goBack}
        >
          <PokemanDetail backToHome={this.goBack} />
        </DetailModal>
      </main>
    );
  }
}

export default withRouter(Main);
