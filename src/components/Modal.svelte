<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let title: string;
	export let cta: string;

	const dispatch = createEventDispatcher();

	const dispatchCloseModal = () => {
		dispatch('close');
	};
</script>

<div class="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">{title}</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true" on:click={dispatchCloseModal}>&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<slot />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary">{cta}</button>
			</div>
		</div>
	</div>
</div>
