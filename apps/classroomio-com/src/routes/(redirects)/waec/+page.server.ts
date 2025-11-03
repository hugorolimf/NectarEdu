import { redirect } from '@sveltejs/kit';

export const load = async () => {
  redirect(307, 'https://form.NectarEDU.com/f/1v25DtmN');
};
