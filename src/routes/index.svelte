<script>
  import { session } from "$app/stores";
  const user = $session && $session.user;
  // console.log($navigating, $page, $session);
</script>

<pre>{JSON.stringify(user)}</pre>

{#if user}
  <img height="64" width="64" src={user.picture} alt="Avatar" />
  <h1>
    Welcome to <a rel="external" href="/api/auth/me"
      >{user.given_name || user.nickname}</a
    >
    |
    <a rel="external" href="/api/auth/logout">Logout</a>
  </h1>
{:else}
  <a rel="external" href="/api/auth/login">Login</a>
{/if}
