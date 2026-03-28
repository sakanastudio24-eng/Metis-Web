# Implementation Flow

This repo is being built in the same order a user experiences the product.

## 1. Get the shape right

The first job is visual honesty. The Figma export gives the tone, rhythm, section order, and motion language. That gets ported into Next.js first so the website already feels like Metis before deeper product wiring starts.

## 2. Ground the copy in the real product

Once the visuals are stable, the copy gets pulled closer to the extension repo. That means the site talks about the hover, the side panel workspace, the scan pipeline, and the score language the way the real product does.

## 3. Add the product gate

The repo now includes a real auth foundation. Supabase handles identity, the website handles sign in and callback flow, and FastAPI exposes the protected backend shape the product will grow into.

## 4. Keep the docs readable

This project should stay approachable to a designer, founder, or engineer who opens the repo for the first time. Notes are written like handoff docs, not like a pile of private implementation shorthand.
