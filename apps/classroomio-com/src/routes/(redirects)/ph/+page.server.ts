import { redirect } from '@sveltejs/kit';

export const load = async () => {
  redirect(307, 'https://www.producthunt.com/posts/NectarEDU-2');
};
