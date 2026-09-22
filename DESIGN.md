---
name: GlobalSync AI — Meridian
description: Warm editorial surfaces and a living paper atlas for work across borders.
colors:
  forest: "#0e2a1f"
  pine: "#1b4d3e"
  ivory: "#f4efe6"
  gold: "#c8a96a"
  sage: "#a7bfae"
  stone: "#d8d2c7"
  muted-text: "#526659"
  closing-surface: "#e4e8dc"
typography:
  display:
    fontFamily: "Playfair Display, serif"
    fontSize: "clamp(60px, 6.5vw, 96px)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, sans-serif"
  tool-title:
    fontFamily: "Playfair Display, serif"
    fontSize: "32px"
    fontWeight: 500
    letterSpacing: "-0.025em"
rounded:
  control: "5px"
  workspace: "6px"
  consent: "12px"
  planner: "16px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.control}"
    padding: "0 25px"
  button-primary-hover:
    backgroundColor: "{colors.pine}"
  button-find-time:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.forest}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
---

# Design System: GlobalSync AI — Meridian

## Overview

**Creative North Star: Meridian.** A warm, editorial world built around forest green, ivory paper, generous serif headlines, and a sculpted atlas. The imagery connects directly to the product's time-zone, currency, and invoice tools. Quiet rules and ample space organize information; small movements make the atlas and tool illustrations feel alive.

**Current scope:** the homepage implements this world, and the shared navigation, footer, and consent surface carry the Meridian identity. Existing tool-page bodies retain their working dark layouts and previous typography. This document does not imply that those bodies have been redesigned. Extend Meridian deliberately without treating legacy tool styles as the preferred starting point for new marketing surfaces.

The implementation sources are `frontend/src/styles/meridian.css`, `frontend/src/styles/meridian-brand.css`, `LandingPage.js`, `MeridianNav.js`, `MeridianConsent.js`, `SiteFooter.js`, and `meridianExperience.js`. The CSS contains earlier rules followed by refinements: the final cascade and rendered components take precedence over obsolete selectors.

Key characteristics:

- Ivory editorial sections alternating with forest utility surfaces.
- Playfair Display headlines paired with DM Sans interface text.
- A complete paper atlas integrated with the page background.
- Thin dividers, restrained rounding, readable data, and visible keyboard focus.

## Colors

The palette uses green as its foundation, warm paper as its main surface, and gold as a selective accent.

- **Forest:** primary text on ivory, filled primary buttons, dark rhythm section, planner results, and footer.
- **Pine:** emphasized italic headlines, primary-button hover, and planner controls.
- **Ivory:** homepage and navigation background; main text on forest surfaces.
- **Gold:** atlas connections, slider thumbs, selected time markers, and the planner's action button. Keep small text on ivory in a darker text color rather than assuming gold provides sufficient contrast.
- **Sage:** secondary information and fine rules on forest surfaces.
- **Stone:** supporting footer text on the homepage.
- **Muted text:** supporting copy and the question field placeholder on ivory. The placeholder uses full opacity.
- **Closing surface:** pale green wash for the closing call to action.

Borders generally use translucent forest on light surfaces and translucent sage on dark ones. Color supports state alongside underlines, borders, labels, and position.

## Typography

**Headline direction:** Playfair Display, serif, generally weight 500. **Interface and body:** DM Sans, sans-serif, with weights 400–700 available. Use italic Playfair sparingly for a phrase within a headline.

- Hero: the display token above, tight line height, and negative tracking. At widths up to 760px the current scale is `clamp(55px, 11vw, 83px)`; up to 360px it becomes 52px.
- General section headings: Playfair Display at `clamp(36px, 4.4vw, 64px)`, line height 1.07, tracking -0.025em. Section-specific sizes intentionally vary.
- Tool-row titles: 32px desktop and 29px on small screens.
- Hero supporting copy: 16px desktop, 14px small-screen, line height 1.8, maximum width 370px before responsive overrides.
- Tool descriptions: 14px desktop, 13px small-screen, line height 1.75, maximum width 340px.
- Labels, captions, and navigation: compact DM Sans, generally 10–14px. Do not apply this compact scale to new long-form body copy.
- Clock values use tabular numbers; the large city readout uses Playfair Display with a responsive 36–80px scale.

Preserve readable labels and numerical alignment in the tools. Typography migration inside legacy tool pages is a separate task.

## Layout

The homepage shell caps at 1512px, with 6% horizontal padding, 5% below 900px, and 23px at widths up to 600px. Desktop hero columns are `.94fr 1.06fr`, with a 42px gap. The atlas remains fully contained at a 1.5 aspect ratio.

Use editorial rows separated by fine horizontal rules for the tool collection. Desktop rows have two equal columns and an 80px gap. The planner and FAQ use `1fr 1.4fr` columns. Major section spacing commonly ranges from 65px to 105px on desktop, with smaller mobile spacing.

At 760px, hero, story, planner, and FAQ stack. At 600px, tool rows and the question form stack, planner controls simplify, and share actions occupy one column. The three-city readout remains three columns with smaller values and spacing.

Shared navigation has its own responsive behavior: desktop links hide at 1000px, showing the menu control. Header height moves from 92px to 80px, then 78px at 600px. The standalone workspace button hides on small screens, but the mobile menu retains its workspace link. Account for the sticky header when scrolling to anchors.

## Elevation & Depth

Depth comes primarily from contrasting surfaces, fine rules, and the atlas artwork. The atlas wrapper is transparent with no CSS box shadow; multiply blending and soft edge masking integrate the artwork with ivory. Preserve the baked-in paper shading instead of adding a detached card around it.

The shared sticky navigation gains `0 7px 22px #0e2a1f10` after scrolling. Planner grouping uses pine against forest. The consent surface uses a border rather than a heavy shadow.

## Shapes

Controls use modest 5–7px radii. The planner is a 16px clipped surface; consent uses 12px. The transparent atlas wrapper has 28px clipping, reduced to 22px on mobile. Tool rows are open compositions bounded by straight rules. Circular forms are reserved for time markers, atlas nodes, and slider thumbs.

## Components

### Buttons and links

Primary homepage actions use forest with ivory text, a 5px radius, a 56px minimum height, and 25px horizontal padding. On small screens their minimum height is 51px. Hover changes forest to pine and lifts the button by 3px; arrow icons move 5px to the right. Transitions use 300ms and `cubic-bezier(.16,1,.3,1)`.

The planner action uses gold on forest, minimum height 46px, and a lighter gold hover. Copy actions use a gold outline; secondary editorial links use an understated bottom rule. Keep action labels explicit and preserve semantic links for navigation.

### Inputs and planner

Planner selects and date fields use forest backgrounds, ivory text, 5px radii, sage borders, and minimum height 48px. Date controls retain their native dark color scheme. Labels sit above fields. Results align city, local time, and working-hours status in rows separated by sage rules.

The question input uses a translucent white background, forest border, 6px radius, and full-opacity muted-text placeholder. Keep the visible label; the placeholder is an example rather than the field's only accessible name.

The planner presents fit feedback through live status text, plus separate copy and calendar-download actions. Preserve factual boundaries in copy: the homepage uses fixed three-city teams and stated working hours; custom settings belong to the full planner.

### Navigation, footer, and consent

Navigation uses the supplied GlobalSync AI image wordmark, ivory surface, forest text, and underline cues for hover/current page. The mobile menu exposes its expanded state, closes on navigation or outside interaction, and returns focus to its toggle when dismissed with Escape. Preserve the skip-to-content link.

The footer uses a forest surface, DM Sans, the supplied light wordmark, and grouped Tools, Resources, and Company links. Its existing responsive grid stacks on small screens.

Consent is a fixed lower-left ivory panel, at most 470px wide with 20px viewport margins, a 12px radius, and two minimum-44px buttons. Both declining and accepting optional cookies remain directly available.

### Atlas and motion

The signature atlas is an image with overlaid decorative SVG routes and nodes. The image and route layer share a 12-second ease-in-out breathing cycle: a small vertical displacement and only ±0.15° rotation. Dashed routes flow over 18 seconds; nodes pulse over 5 seconds with staggered phases. Pointer tilt is subtle, resets on pointer leave, and excludes touch input.

Pause motion is an explicit, in-flow button with pressed state. Atlas animation pauses when its hero is out of view or the document is hidden. `prefers-reduced-motion: reduce` disables animations, transitions, tilt, and smooth scrolling. Motion must never hide essential content or become a prerequisite for using a tool.

Tool illustrations respond to hover with small changes: the connecting time marker travels, currency arrows shift, and the invoice straightens. Native FAQ disclosures keep their text accessible and rotate a plus icon on expansion.

### Focus

Homepage controls generally use a 3px gold outline with 5px offset. Shared navigation and consent use darker gold `#947135` on ivory; footer links use a 2px gold outline. FAQ summaries use a pine outline. Preserve visible focus with adequate contrast on each surface.

## Do's and Don'ts

- **Do** use the established green, paper, and gold palette with clear surface roles.
- **Do** keep the whole atlas legible and visually integrated with the hero background.
- **Do** use editorial spacing and rules for marketing content, and aligned rows for data.
- **Do** preserve reduced-motion behavior, the pause control, keyboard focus, and descriptive labels.
- **Do** describe the actual tool behavior and acknowledge the existing tool-body styling when assessing scope.
- **Don't** reintroduce a raised opaque card or shine sweep around the atlas.
- **Don't** use pale gold or sage for small text on ivory without checking contrast.
- **Don't** substitute decorative animation for working controls or status feedback.
- **Don't** claim that all tool pages already use the Meridian headline and body system.
- **Don't** add unsupported trust badges, customer counts, or claims to fill visual space.
