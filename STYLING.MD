## CSS Style Guide

This is a quick guide for writing clean and readable (S)CSS

# File structure

Each component should live in a directory, which contains `index.js` (Your component code) and `style.scss` (styling specific to that component). This way it's easy to just import the directory, and the build system automatically grabs index.js for you. The directory name should be equal to the component's name - this way it's easy to just import the folder. For example:

- ListItem
	- index.js
	- style.scss
- AnotherComponent
	- index.js
	- style.scss

# Naming your classes

```
class ListItem extends Component {

	render() {
		return(
			<div className="ListItem">
				<div className="ListItem--avatar">
					<img className="ListItem--avatar__img" src="/path/to/avatar"/>
				</div>
				<div className="ListItem--details">
					<h4 className="ListItem--details__name">John Doe</h4>
					<p className="ListItem--details__phone-number">+3581234567</p>
				</div>
			</div>
		)
	}
}
```

* The outermost element has a class name equal to the component's name, `ListItem`
* Each sub-section of the component is denoted with `ComponentName--section-name`, and each level below that with a further __identifier

Makes sense, but what if I have more than three levels of hierarchy?

* This might be a good place to consider breaking up the component into sub-components, where you have a fresh three levels of hierarchy to use!


# Writing SCSS like a boss

First of all, when writing JSX, it would be recommended to give classnames to all of the components you intend to give styles to. This means that you should **not** apply styles with element selectors such as `h1` or `span`. 

If we want to style the above ListItem component, the style.scss file might look something like this:

```
.ListItem {

	&--avatar {
		/* styles for .ListItem--avatar */
		&__img {
			/* styles for .ListItem--avatar__img */
		}
	}

	&--details {

		&__name {

		}

		&__phone-number {

		}
	}
}
```

This way

* Your CSS styles have **no possible way** to affect your styling in any other component
* You can clearly see the element hierarchy from within your .scss code
* It just looks really nice and readable

In some cases, you might need to use the entire classname of a child element, such as when applying styles to the children when the parent is hovered:

```
.ListItem {
	&:hover {
		&--avatar {
			/* Doesn't do anything (targets .ListItem:hover--avatar, which is not a valid selector) */
		}
	}

	&:hover {
		.ListItem--avatar {
			/* Applies styles to .ListItem--avatar, when .ListItem is hovered :) */
		}
	}
}
```

There are ways to get around this as well, if you're willing to read into some more [advanced scss](https://stackoverflow.com/questions/26519561/sass-referencing-parent-selectors-using-the-ampersand-character-within-nested-se), but in general I would recommend just using the above way, it's slightly more readable.
