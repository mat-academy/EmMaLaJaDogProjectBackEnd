
select 
	breed_name, count(breed_name) 
from 
	votes
group by
	breed_name
order by 
	count(breed_name) desc
limit 10


