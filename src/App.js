import React, {useEffect, useState} from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {
  
  const [movieList, setMovieList] = useState([]);

  const [featuredData, setFeaturedData] = useState(null);

  const [blackHeader, setBlackHeader] = useState(false);

  useEffect (()=>{
    const loadALL = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i=>i.slug === 'originals'); //filtrando apenas dos originais para ter itens no Destaque!
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));//gerando um nº aleatório para mostrar um item diferente dos originais na minha tela.
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    
    } 
    
    loadALL();
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);      
      } 
      else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }

  }, []);

  return (
   <div className='page'> 

      <Header black={blackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData} />
        }

      <section className='lists'>
        {movieList.map((item,key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

          <footer>
            Feito totalmente para meus estudos e sem fins lucrativos!<br/>
            Direitos de imagem para Netflix, afinal ela foi minha inspiração <span role="img" aria-label="coração">❤️</span><br/>
            Dados pegos através do site themoviedb.org <br/>
          </footer>

      {movieList.length <= 0 &&
          <div className="loading">
            <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
          </div>
        }
    </div>
   
  );
 
}