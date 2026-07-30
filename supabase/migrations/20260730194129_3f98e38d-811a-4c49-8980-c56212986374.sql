revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.grant_bootstrap_admin() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke all on function public.increment_prompt_metric(uuid, text) from public;
grant execute on function public.increment_prompt_metric(uuid, text) to anon, authenticated;