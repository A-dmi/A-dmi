const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = "https://image.tmdb.org/t/p/w500";

function apiSearch(event) {
	event.preventDefault();
	const searchText = document.querySelector('.form-control').value;
	if(searchText.length === 0){
		movie.innerHTML = '<h2 class="col-12 text-center text-danger">ENTER THE FILM NAME!</h2>';
		return
	}
		movie.innerHTML = '<div class="spinner"></div>';

		fetch('https://api.themoviedb.org/3/search/multi?api_key=33b6815092aa26daf965a142296b5d0d&language=ru&query=' + searchText)
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			return value.json();
		})
		.then(function(output){
			let inner = '';
			if(output.results.length === 0){
				inner = '<h2 class="col-12 text-center text-info">Sorry, we can`t found anything</h2>';
			}
			output.results.forEach(function (item){
				let nameItem = item.name || item.title;
				const poster = item.poster_path ? urlPoster + item.poster_path : './img/poster.jpg';
				let dataInfo = '';
				if(item.media_type !== 'person') dataInfo = `data-id="${item.id}"
					data-type="${item.media_type}"`;	
				inner += `
				<div class="col-12 col-md-4 col-xl-3 item">
				<img src="${poster}" class="img_poster" alt+"${nameItem}" ${dataInfo}>
				<h5>${nameItem}</h5>
				</div>`;
			});
			movie.innerHTML = inner;

			addEventMedia();

		})
		.catch(function(reason){
			movie.innerHTML = 'Something went wrong!';
			console.log('error: ' + request.status);
		});

}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
	const media = movie.querySelectorAll('img[data-id]');
	media.forEach(function(elem){
		elem.style.cursor = 'pointer';
		elem.addEventListener('click', showFulInfo)
	});
} 

function showFulInfo(){
	let url = '';
	console.dir(this.dataset);
	if(this.dataset.type === 'movie'){
		url = 'https://api.themoviedb.org/3/movie/'+ this.dataset.id +'?api_key=33b6815092aa26daf965a142296b5d0d&language=ru';
	}else if (this.dataset.type === 'tv') {
		url = 'https://api.themoviedb.org/3/tv/'+ this.dataset.id +'?api_key=33b6815092aa26daf965a142296b5d0d&language=ru';
	}else{
		movie.innerHTML = '<h2 class="col-12 text-center text-danger">ERROR TRY LETTER</h2>';
	}



	fetch(url)
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			return value.json();
		})
		.then(function(output){
			console.log(output);
			const poster = output.poster_path ? urlPoster + output.poster_path : './img/poster.jpg';
			movie.innerHTML = `
			<h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
			<div class="col-4">
				<img src='${poster}' alt='${output.name || output.title}'>
				${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Offisial sate</a></p>` : ''}
				${(output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.indb_id}" target="_blank">Link on IMDB.com</a></p>` : ''}
			</div>
			<div class="col-8">
				<p>Rating: ${output.vote_average}</p>
				<p>Status: ${output.status}</p>
				<p>Premiere: ${output.first_air_date || output.release_date}</p>
				${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} seasons and series came out: ${output.last_episode_to_air.episode_number}` : ''} 
				${(output.next_episode_to_air) ? `<p>Date of the the next episode: ${output.next_episode_to_air.air_date}` : ''} 
				<p>Description: ${output.overview}</p>
				<br>
				<dir class='youtube'>

				</dir>
			</div>
			`;

			
		})
		.catch(function(reason){
			movie.innerHTML = 'Something went wrong!';
			console.error(reason || reason.status);
		});

}

document.addEventListener('DOMContentLoaded', function(){
	fetch('https://api.themoviedb.org/3/trending/all/week?api_key=33b6815092aa26daf965a142296b5d0d&language=ru')
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			return value.json();
		})
		.then(function(output){
			let inner = '<h2 class="col-12 text-center text-info">Popular for week:</h2>';
			if(output.results.length === 0){
				inner = '<h2 class="col-12 text-center text-info">Sorry, we can`t found anything</h2>';
			}
			output.results.forEach(function (item){
				let nameItem = item.name || item.title;
				let mediaType = item.title ? 'movie' : 'tv';
				const poster = item.poster_path ? urlPoster + item.poster_path : './img/poster.jpg';
				let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
				inner += `
				<div class="col-12 col-md-4 col-xl-3 item">
				<img src="${poster}" class="img_poster" alt+"${nameItem}" ${dataInfo}>
				<h5>${nameItem}</h5>
				</div>`;
			});
			movie.innerHTML = inner;

			addEventMedia();

		})
		.catch(function(reason){
			movie.innerHTML = 'Something went wrong!';
			console.log('error: ' + request.status);
		});
})