<script>
    import {callServer} from "./utils";
    import Menu from './menu.svelte';

    let name = "";
    let email = "";
    let message = "";
    let resp = "";
    async function submit(){
        let data = {name, email, message};
        let rc = await callServer("POST", "/contact", data);
        resp = JSON.parse(rc);
        return false;
    }
    async function reset(){
        resp = null;
    }
</script>

<Menu>
{#if resp}
    <div class="max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10">

        <div class="text-md mb-6">
            {#if resp.code == 'OK'}
                <ul class="list-disc">
                    {@html resp.resp}
                </ul>
            {:else}
                <div class="text-md mb-6">
                    {@html resp.resp}
                </div>
            {/if}
        </div>

        <div class="grid grid-cols-2 gap-4 max-w-xl m-auto">
            <div class="col-span-2 lg:col-span-1">
                <input disabled value={resp.name} type="text" class="bg-gray-300 rounded-md p-3 md:text-xl w-full" />
            </div>
        
            <div class="col-span-2 lg:col-span-1">
                <input disabled value={resp.email} type="email" class="bg-gray-300 rounded-md p-3 md:text-xl w-full"/>
            </div>
        
            <div class="col-span-2">
                <textarea disabled value={resp.message} cols="30" rows="8" maxlength="1000" class="bg-gray-300 rounded-md p-3 md:text-xl w-full" placeholder="Message"></textarea>
            </div>
            <div class="col-span-2 text-right">
                <button on:click={reset} class="rounded-md py-3 px-6 bg-green-500 text-white font-bold w-full sm:w-32">
                    Reset
                </button>
            </div>
        </div>
    </div>

{:else}
    <div class="max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10">

        <div class="text-3xl mb-6 text-center ">
            Got a question / problem?
        </div>
        <form on:submit|preventDefault="{submit}">
        <div class="grid grid-cols-2 gap-4 max-w-xl m-auto">
            <div class="col-span-2 lg:col-span-1">
                <input bind:value={name} type="text" required class="rounded-md border-solid border-blue-400 border-2 p-3 md:text-xl w-full" placeholder="Name"/>
            </div>
        
            <div class="col-span-2 lg:col-span-1">
                <input bind:value={email} type="email" required class="rounded-md border-solid border-blue-400 border-2 p-3 md:text-xl w-full" placeholder="Email Address"/>
            </div>
        
            <div class="col-span-2">
                <textarea bind:value={message} required cols="30" rows="8" maxlength="1000" class="rounded-md border-solid border-blue-400 border-2 p-3 md:text-xl w-full" placeholder="Message"></textarea>
            </div>
        
            <div class="col-span-2 text-right">
                <button type="submit" class="rounded-md py-3 px-6 bg-green-500 text-white font-bold w-full sm:w-32">
                    Submit
                </button>
            </div>
        </div>
        </form>        
    </div>
{/if}
</Menu>

