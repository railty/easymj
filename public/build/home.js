var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\menu.svelte generated by Svelte v3.31.0 */
    const file = "src\\components\\menu.svelte";

    function create_fragment(ctx) {
    	let div11;
    	let nav;
    	let div6;
    	let div5;
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div2;
    	let div1;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let div4;
    	let button;
    	let span;
    	let t8;
    	let svg0;
    	let path0;
    	let svg0_class_value;
    	let t9;
    	let svg1;
    	let path1;
    	let svg1_class_value;
    	let t10;
    	let div8;
    	let div7;
    	let a3;
    	let t12;
    	let a4;
    	let t14;
    	let a5;
    	let div8_class_value;
    	let t16;
    	let header;
    	let div9;
    	let h1;
    	let t17;
    	let t18;
    	let main;
    	let div10;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			nav = element("nav");
    			div6 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Privacy Policy";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Contact US";
    			t6 = space();
    			div4 = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "Open main menu";
    			t8 = space();
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t9 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t10 = space();
    			div8 = element("div");
    			div7 = element("div");
    			a3 = element("a");
    			a3.textContent = "Home";
    			t12 = space();
    			a4 = element("a");
    			a4.textContent = "Privacy Policy";
    			t14 = space();
    			a5 = element("a");
    			a5.textContent = "Contact Us";
    			t16 = space();
    			header = element("header");
    			div9 = element("div");
    			h1 = element("h1");
    			t17 = text(/*selectedMenu*/ ctx[0]);
    			t18 = space();
    			main = element("main");
    			div10 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(img, "class", "h-16 w-16 svelte-1hwhrh2");
    			if (img.src !== (img_src_value = "/css/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "fa");
    			add_location(img, file, 23, 5, 458);
    			attr_dev(div0, "class", "flex-shrink-0 svelte-1hwhrh2");
    			add_location(div0, file, 22, 3, 425);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium svelte-1hwhrh2");
    			add_location(a0, file, 28, 4, 721);
    			attr_dev(a1, "href", "/privacy.html");
    			attr_dev(a1, "class", "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium svelte-1hwhrh2");
    			add_location(a1, file, 29, 6, 851);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium svelte-1hwhrh2");
    			add_location(a2, file, 30, 6, 998);
    			attr_dev(div1, "class", "ml-10 flex items-baseline space-x-4 svelte-1hwhrh2");
    			add_location(div1, file, 26, 5, 559);
    			attr_dev(div2, "class", "hidden md:block svelte-1hwhrh2");
    			add_location(div2, file, 25, 3, 524);
    			attr_dev(div3, "class", "flex items-center svelte-1hwhrh2");
    			add_location(div3, file, 21, 4, 390);
    			attr_dev(span, "class", "sr-only svelte-1hwhrh2");
    			add_location(span, file, 37, 5, 1522);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M4 6h16M4 12h16M4 18h16");
    			attr_dev(path0, "class", "svelte-1hwhrh2");
    			add_location(path0, file, 44, 4, 1829);
    			attr_dev(svg0, "class", svg0_class_value = "" + ((/*menuOpen*/ ctx[1] ? "hidden" : "block") + " h-6 w-6" + " svelte-1hwhrh2"));
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "aria-hidden", "true");
    			add_location(svg0, file, 43, 5, 1663);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-width", "2");
    			attr_dev(path1, "d", "M6 18L18 6M6 6l12 12");
    			attr_dev(path1, "class", "svelte-1hwhrh2");
    			add_location(path1, file, 52, 4, 2202);
    			attr_dev(svg1, "class", svg1_class_value = "" + ((/*menuOpen*/ ctx[1] ? "block" : "hidden") + " h-6 w-6" + " svelte-1hwhrh2"));
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "aria-hidden", "true");
    			add_location(svg1, file, 51, 5, 2036);
    			attr_dev(button, "class", "bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white svelte-1hwhrh2");
    			add_location(button, file, 36, 3, 1268);
    			attr_dev(div4, "class", "-mr-2 flex md:hidden svelte-1hwhrh2");
    			add_location(div4, file, 34, 4, 1199);
    			attr_dev(div5, "class", "flex items-center justify-between h-16 svelte-1hwhrh2");
    			add_location(div5, file, 20, 2, 333);
    			attr_dev(div6, "class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 svelte-1hwhrh2");
    			add_location(div6, file, 19, 3, 278);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium svelte-1hwhrh2");
    			add_location(a3, file, 67, 4, 2680);
    			attr_dev(a4, "href", "/privacy.html");
    			attr_dev(a4, "class", "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium svelte-1hwhrh2");
    			add_location(a4, file, 68, 4, 2816);
    			attr_dev(a5, "href", "#");
    			attr_dev(a5, "class", "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium svelte-1hwhrh2");
    			add_location(a5, file, 69, 4, 2969);
    			attr_dev(div7, "class", "px-2 pt-2 pb-3 space-y-1 sm:px-3 svelte-1hwhrh2");
    			add_location(div7, file, 65, 2, 2521);
    			attr_dev(div8, "class", div8_class_value = "" + ((/*menuOpen*/ ctx[1] ? "block" : "hidden") + " md:hidden" + " svelte-1hwhrh2"));
    			add_location(div8, file, 64, 3, 2464);
    			attr_dev(nav, "class", "bg-gray-800 svelte-1hwhrh2");
    			add_location(nav, file, 18, 1, 249);
    			attr_dev(h1, "class", "text-3xl font-bold leading-tight text-gray-900 svelte-1hwhrh2");
    			add_location(h1, file, 76, 2, 3266);
    			attr_dev(div9, "class", "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 svelte-1hwhrh2");
    			add_location(div9, file, 75, 3, 3206);
    			attr_dev(header, "class", "bg-white shadow svelte-1hwhrh2");
    			add_location(header, file, 74, 1, 3170);
    			attr_dev(div10, "class", "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 svelte-1hwhrh2");
    			add_location(div10, file, 82, 3, 3385);
    			attr_dev(main, "class", "svelte-1hwhrh2");
    			add_location(main, file, 81, 1, 3375);
    			attr_dev(div11, "class", "svelte-1hwhrh2");
    			add_location(div11, file, 17, 0, 242);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, nav);
    			append_dev(nav, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t2);
    			append_dev(div1, a1);
    			append_dev(div1, t4);
    			append_dev(div1, a2);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, button);
    			append_dev(button, span);
    			append_dev(button, t8);
    			append_dev(button, svg0);
    			append_dev(svg0, path0);
    			append_dev(button, t9);
    			append_dev(button, svg1);
    			append_dev(svg1, path1);
    			append_dev(nav, t10);
    			append_dev(nav, div8);
    			append_dev(div8, div7);
    			append_dev(div7, a3);
    			append_dev(div7, t12);
    			append_dev(div7, a4);
    			append_dev(div7, t14);
    			append_dev(div7, a5);
    			append_dev(div11, t16);
    			append_dev(div11, header);
    			append_dev(header, div9);
    			append_dev(div9, h1);
    			append_dev(h1, t17);
    			append_dev(div11, t18);
    			append_dev(div11, main);
    			append_dev(main, div10);

    			if (default_slot) {
    				default_slot.m(div10, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(a2, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(button, "click", /*openMenu*/ ctx[2], false, false, false),
    					listen_dev(a3, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(a5, "click", /*click_handler_3*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*menuOpen*/ 2 && svg0_class_value !== (svg0_class_value = "" + ((/*menuOpen*/ ctx[1] ? "hidden" : "block") + " h-6 w-6" + " svelte-1hwhrh2"))) {
    				attr_dev(svg0, "class", svg0_class_value);
    			}

    			if (!current || dirty & /*menuOpen*/ 2 && svg1_class_value !== (svg1_class_value = "" + ((/*menuOpen*/ ctx[1] ? "block" : "hidden") + " h-6 w-6" + " svelte-1hwhrh2"))) {
    				attr_dev(svg1, "class", svg1_class_value);
    			}

    			if (!current || dirty & /*menuOpen*/ 2 && div8_class_value !== (div8_class_value = "" + ((/*menuOpen*/ ctx[1] ? "block" : "hidden") + " md:hidden" + " svelte-1hwhrh2"))) {
    				attr_dev(div8, "class", div8_class_value);
    			}

    			if (!current || dirty & /*selectedMenu*/ 1) set_data_dev(t17, /*selectedMenu*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Menu", slots, ['default']);

    	onMount(async () => {
    		
    	});

    	function openMenu() {
    		$$invalidate(1, menuOpen = !menuOpen);
    	}

    	function click(menu) {
    		$$invalidate(0, selectedMenu = menu);
    	}

    	let menuOpen = false;
    	let { selectedMenu = "Home" } = $$props;
    	const writable_props = ["selectedMenu"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		click("Home");
    	};

    	const click_handler_1 = () => {
    		click("Contact US");
    	};

    	const click_handler_2 = () => {
    		click("Home");
    	};

    	const click_handler_3 = () => {
    		click("Contact US");
    	};

    	$$self.$$set = $$props => {
    		if ("selectedMenu" in $$props) $$invalidate(0, selectedMenu = $$props.selectedMenu);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		openMenu,
    		click,
    		menuOpen,
    		selectedMenu
    	});

    	$$self.$inject_state = $$props => {
    		if ("menuOpen" in $$props) $$invalidate(1, menuOpen = $$props.menuOpen);
    		if ("selectedMenu" in $$props) $$invalidate(0, selectedMenu = $$props.selectedMenu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedMenu,
    		menuOpen,
    		openMenu,
    		click,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { selectedMenu: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get selectedMenu() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedMenu(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    async function callServer(method, url, data) {
        let p = new Promise((resolve, reject) => {
            
            let params = new URLSearchParams();
            let ks = Object.keys(data);
            for (let k of ks){
                params.set(k, data[k]);
            }
            url = url + "?" + params.toString();

            let http = new XMLHttpRequest();
            http.open(method, url, true);
            //http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4) {
                     if (http.status == 200){
                        let rc = http.responseText;
                        resolve(rc);
                     }
                     else {
                         resolve({
                             code:'warning',
                             message: http.statusText
                         });
                     }
                }
            };

            http.send();
        });
        return p;
    }

    /* src\components\contactUs.svelte generated by Svelte v3.31.0 */
    const file$1 = "src\\components\\contactUs.svelte";

    // (54:0) {:else}
    function create_else_block_1(ctx) {
    	let div6;
    	let div0;
    	let t1;
    	let form;
    	let div5;
    	let div1;
    	let input0;
    	let t2;
    	let div2;
    	let input1;
    	let t3;
    	let div3;
    	let textarea;
    	let t4;
    	let div4;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			div0.textContent = "Got a question / problem?";
    			t1 = space();
    			form = element("form");
    			div5 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t2 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t3 = space();
    			div3 = element("div");
    			textarea = element("textarea");
    			t4 = space();
    			div4 = element("div");
    			button = element("button");
    			button.textContent = "Submit";
    			attr_dev(div0, "class", "text-3xl mb-6 text-center ");
    			add_location(div0, file$1, 56, 8, 1838);
    			attr_dev(input0, "type", "text");
    			input0.required = true;
    			attr_dev(input0, "class", "rounded-md border-solid border-blue-400 border-2 p-3 md:text-xl w-full");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$1, 62, 16, 2111);
    			attr_dev(div1, "class", "col-span-2 lg:col-span-1");
    			add_location(div1, file$1, 61, 12, 2056);
    			attr_dev(input1, "type", "email");
    			input1.required = true;
    			attr_dev(input1, "class", "rounded-md border-solid border-blue-400 border-2 p-3 md:text-xl w-full");
    			attr_dev(input1, "placeholder", "Email Address");
    			add_location(input1, file$1, 66, 16, 2352);
    			attr_dev(div2, "class", "col-span-2 lg:col-span-1");
    			add_location(div2, file$1, 65, 12, 2297);
    			textarea.required = true;
    			attr_dev(textarea, "cols", "30");
    			attr_dev(textarea, "rows", "8");
    			attr_dev(textarea, "maxlength", "1000");
    			attr_dev(textarea, "class", "rounded-md border-solid border-blue-400 border-2 p-3 md:text-xl w-full");
    			attr_dev(textarea, "placeholder", "Message");
    			add_location(textarea, file$1, 70, 16, 2590);
    			attr_dev(div3, "class", "col-span-2");
    			add_location(div3, file$1, 69, 12, 2549);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "rounded-md py-3 px-6 bg-green-500 text-white font-bold w-full sm:w-32");
    			add_location(button, file$1, 74, 16, 2871);
    			attr_dev(div4, "class", "col-span-2 text-right");
    			add_location(div4, file$1, 73, 12, 2819);
    			attr_dev(div5, "class", "grid grid-cols-2 gap-4 max-w-xl m-auto");
    			add_location(div5, file$1, 60, 8, 1991);
    			add_location(form, file$1, 59, 8, 1940);
    			attr_dev(div6, "class", "max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10");
    			add_location(div6, file$1, 54, 4, 1765);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div6, t1);
    			append_dev(div6, form);
    			append_dev(form, div5);
    			append_dev(div5, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*name*/ ctx[0]);
    			append_dev(div5, t2);
    			append_dev(div5, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*email*/ ctx[1]);
    			append_dev(div5, t3);
    			append_dev(div5, div3);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*message*/ ctx[2]);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[8]),
    					listen_dev(form, "submit", prevent_default(/*submit*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
    				set_input_value(input0, /*name*/ ctx[0]);
    			}

    			if (dirty & /*email*/ 2 && input1.value !== /*email*/ ctx[1]) {
    				set_input_value(input1, /*email*/ ctx[1]);
    			}

    			if (dirty & /*message*/ 4) {
    				set_input_value(textarea, /*message*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:0) {#if resp}
    function create_if_block(ctx) {
    	let div6;
    	let div0;
    	let t0;
    	let div5;
    	let div1;
    	let input0;
    	let input0_value_value;
    	let t1;
    	let div2;
    	let input1;
    	let input1_value_value;
    	let t2;
    	let div3;
    	let textarea;
    	let textarea_value_value;
    	let t3;
    	let div4;
    	let button;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*resp*/ ctx[3].code == "OK") return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div5 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t1 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t2 = space();
    			div3 = element("div");
    			textarea = element("textarea");
    			t3 = space();
    			div4 = element("div");
    			button = element("button");
    			button.textContent = "Reset";
    			attr_dev(div0, "class", "text-md mb-6");
    			add_location(div0, file$1, 21, 8, 476);
    			input0.disabled = true;
    			input0.value = input0_value_value = /*resp*/ ctx[3].name;
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "bg-gray-300 rounded-md p-3 md:text-xl w-full");
    			add_location(input0, file$1, 35, 16, 924);
    			attr_dev(div1, "class", "col-span-2 lg:col-span-1");
    			add_location(div1, file$1, 34, 12, 869);
    			input1.disabled = true;
    			input1.value = input1_value_value = /*resp*/ ctx[3].email;
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "bg-gray-300 rounded-md p-3 md:text-xl w-full");
    			add_location(input1, file$1, 39, 16, 1121);
    			attr_dev(div2, "class", "col-span-2 lg:col-span-1");
    			add_location(div2, file$1, 38, 12, 1066);
    			textarea.disabled = true;
    			textarea.value = textarea_value_value = /*resp*/ ctx[3].message;
    			attr_dev(textarea, "cols", "30");
    			attr_dev(textarea, "rows", "8");
    			attr_dev(textarea, "maxlength", "1000");
    			attr_dev(textarea, "class", "bg-gray-300 rounded-md p-3 md:text-xl w-full");
    			attr_dev(textarea, "placeholder", "Message");
    			add_location(textarea, file$1, 43, 16, 1305);
    			attr_dev(div3, "class", "col-span-2");
    			add_location(div3, file$1, 42, 12, 1264);
    			attr_dev(button, "class", "rounded-md py-3 px-6 bg-green-500 text-white font-bold w-full sm:w-32");
    			add_location(button, file$1, 46, 16, 1551);
    			attr_dev(div4, "class", "col-span-2 text-right");
    			add_location(div4, file$1, 45, 12, 1499);
    			attr_dev(div5, "class", "grid grid-cols-2 gap-4 max-w-xl m-auto");
    			add_location(div5, file$1, 33, 8, 804);
    			attr_dev(div6, "class", "max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10");
    			add_location(div6, file$1, 19, 4, 403);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			if_block.m(div0, null);
    			append_dev(div6, t0);
    			append_dev(div6, div5);
    			append_dev(div5, div1);
    			append_dev(div1, input0);
    			append_dev(div5, t1);
    			append_dev(div5, div2);
    			append_dev(div2, input1);
    			append_dev(div5, t2);
    			append_dev(div5, div3);
    			append_dev(div3, textarea);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*reset*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*resp*/ 8 && input0_value_value !== (input0_value_value = /*resp*/ ctx[3].name) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*resp*/ 8 && input1_value_value !== (input1_value_value = /*resp*/ ctx[3].email) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty & /*resp*/ 8 && textarea_value_value !== (textarea_value_value = /*resp*/ ctx[3].message)) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(19:0) {#if resp}",
    		ctx
    	});

    	return block;
    }

    // (27:12) {:else}
    function create_else_block(ctx) {
    	let div;
    	let raw_value = /*resp*/ ctx[3].resp + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "text-md mb-6");
    			add_location(div, file$1, 27, 16, 674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*resp*/ 8 && raw_value !== (raw_value = /*resp*/ ctx[3].resp + "")) div.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(27:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:12) {#if resp.code == 'OK'}
    function create_if_block_1(ctx) {
    	let ul;
    	let raw_value = /*resp*/ ctx[3].resp + "";

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			attr_dev(ul, "class", "list-disc");
    			add_location(ul, file$1, 23, 16, 555);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			ul.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*resp*/ 8 && raw_value !== (raw_value = /*resp*/ ctx[3].resp + "")) ul.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(23:12) {#if resp.code == 'OK'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*resp*/ ctx[3]) return create_if_block;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ContactUs", slots, []);
    	let name = "";
    	let email = "";
    	let message = "";
    	let resp = "";

    	async function submit() {
    		let data = { name, email, message };
    		let rc = await callServer("POST", "/contact", data);
    		$$invalidate(3, resp = JSON.parse(rc));
    		return false;
    	}

    	async function reset() {
    		$$invalidate(3, resp = null);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ContactUs> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	function input1_input_handler() {
    		email = this.value;
    		$$invalidate(1, email);
    	}

    	function textarea_input_handler() {
    		message = this.value;
    		$$invalidate(2, message);
    	}

    	$$self.$capture_state = () => ({
    		callServer,
    		name,
    		email,
    		message,
    		resp,
    		submit,
    		reset
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("email" in $$props) $$invalidate(1, email = $$props.email);
    		if ("message" in $$props) $$invalidate(2, message = $$props.message);
    		if ("resp" in $$props) $$invalidate(3, resp = $$props.resp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		email,
    		message,
    		resp,
    		submit,
    		reset,
    		input0_input_handler,
    		input1_input_handler,
    		textarea_input_handler
    	];
    }

    class ContactUs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContactUs",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\home\Home.svelte generated by Svelte v3.31.0 */

    const { console: console_1 } = globals;
    const file$2 = "src\\home\\Home.svelte";

    // (21:1) {:else}
    function create_else_block$1(ctx) {
    	let h10;
    	let a0;
    	let t1;
    	let h11;
    	let a1;

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			a0 = element("a");
    			a0.textContent = "Download from Apple App Store";
    			t1 = space();
    			h11 = element("h1");
    			a1 = element("a");
    			a1.textContent = "Play in browser";
    			attr_dev(a0, "href", "web-mobile");
    			attr_dev(a0, "class", "svelte-1qrh9ez");
    			add_location(a0, file$2, 21, 70, 463);
    			attr_dev(h10, "class", "p-4 text-lg font-bold text-blue-600 hover:text-blue-300 svelte-1qrh9ez");
    			add_location(h10, file$2, 21, 2, 395);
    			attr_dev(a1, "href", "web-mobile");
    			attr_dev(a1, "class", "svelte-1qrh9ez");
    			add_location(a1, file$2, 22, 73, 596);
    			attr_dev(h11, "class", "p-4 text-lg font-bold text-blue-600 hover:text-blue-300 svelte-1qrh9ez");
    			add_location(h11, file$2, 22, 5, 528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			append_dev(h10, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h11, anchor);
    			append_dev(h11, a1);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(21:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:1) {#if selectedMenu == 'Contact US'}
    function create_if_block$1(ctx) {
    	let contactus;
    	let current;
    	contactus = new ContactUs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contactus.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contactus, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contactus, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(19:1) {#if selectedMenu == 'Contact US'}",
    		ctx
    	});

    	return block;
    }

    // (18:0) <Menu bind:selectedMenu>
    function create_default_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selectedMenu*/ ctx[0] == "Contact US") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(18:0) <Menu bind:selectedMenu>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let menu;
    	let updating_selectedMenu;
    	let current;

    	function menu_selectedMenu_binding(value) {
    		/*menu_selectedMenu_binding*/ ctx[1].call(null, value);
    	}

    	let menu_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*selectedMenu*/ ctx[0] !== void 0) {
    		menu_props.selectedMenu = /*selectedMenu*/ ctx[0];
    	}

    	menu = new Menu({ props: menu_props, $$inline: true });
    	binding_callbacks.push(() => bind(menu, "selectedMenu", menu_selectedMenu_binding));

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const menu_changes = {};

    			if (dirty & /*$$scope, selectedMenu*/ 17) {
    				menu_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selectedMenu && dirty & /*selectedMenu*/ 1) {
    				updating_selectedMenu = true;
    				menu_changes.selectedMenu = /*selectedMenu*/ ctx[0];
    				add_flush_callback(() => updating_selectedMenu = false);
    			}

    			menu.$set(menu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);

    	onMount(async () => {
    		console.log("on mount");
    	});

    	function openMenu() {
    		menuOpen = !menuOpen;
    	}

    	let menuOpen = false;
    	let selectedMenu;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function menu_selectedMenu_binding(value) {
    		selectedMenu = value;
    		$$invalidate(0, selectedMenu);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Menu,
    		ContactUs,
    		openMenu,
    		menuOpen,
    		selectedMenu
    	});

    	$$self.$inject_state = $$props => {
    		if ("menuOpen" in $$props) menuOpen = $$props.menuOpen;
    		if ("selectedMenu" in $$props) $$invalidate(0, selectedMenu = $$props.selectedMenu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedMenu, menu_selectedMenu_binding];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new Home({
    	target: document.getElementById("app"),
    });

    return app;

}());
//# sourceMappingURL=home.js.map
