import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { Carousel, Image, Poster, Section, Video } from 'components';
import {
    fetchCast,
    fetchImages,
    fetchMovie,
    fetchSimilar,
    fetchVideos,
    updateSimilar,
} from '_core/movie/middlewares';
import { Credits, MovieBackground, MovieDetails, Overview } from './Components';
import './movieView.scss';
import { useInfiniteScroll } from 'hooks';
import { Link, useParams } from 'react-router-dom';

export const MovieView = () => {
    let { movieID = '' } = useParams<'movieID'>();
    const dispatch = useDispatch();

    const { loading, movie, images, videos, cast, similar } = useSelector(
        (state: RootState) => state.movie
    );

    const { page, setPage, setLimit } = useInfiniteScroll(similar);

    useEffect(() => {
        setPage(1);
        dispatch(fetchMovie(movieID));
        dispatch(fetchImages(movieID));
        dispatch(fetchVideos(movieID));
        dispatch(fetchCast(movieID));
        dispatch(fetchSimilar(movieID));
    }, [movieID]);

    useEffect(() => {
        if (page > 1) dispatch(updateSimilar(movieID, page));
    }, [page]);

    return movie && !loading ? (
        <div className="movie-view">
            <MovieBackground
                backdrop_path={movie.backdrop_path}
                original_title={movie.original_title}
            />

            <div className="container-first">
                <Overview movie={movie} />

                <MovieDetails movie={movie} poster={images?.posters?.at(0)} />

                {images?.backdrops && (
                    <Section title="Images">
                        <Carousel id={movieID}>
                            {images.backdrops.map((image, i) => (
                                <Image image={image} key={i} />
                            ))}
                        </Carousel>
                    </Section>
                )}

                {!!videos?.length && (
                    <Section title="Videos">
                        <Carousel id={movieID}>
                            {videos.map((video, i) => (
                                <Video video={video} key={i} />
                            ))}
                        </Carousel>
                    </Section>
                )}

                {!!cast?.length && (
                    <Section title="Cast">
                        <Credits cast={cast} />
                    </Section>
                )}

                <br />

                {!!similar?.total_results && (
                    <Section title="Similars">
                        <Carousel id={movieID} scrollLimit={setLimit}>
                            {similar?.results?.map((poster, i) => (
                                <Link to={`/movies/movie/${poster.id}`} key={i}>
                                    <Poster
                                        posterPath={poster.poster_path}
                                        posterID={poster.id}
                                    />
                                </Link>
                            ))}
                        </Carousel>
                    </Section>
                )}

                <br />
                <br />
            </div>
        </div>
    ) : (
        <div></div>
    );
};
