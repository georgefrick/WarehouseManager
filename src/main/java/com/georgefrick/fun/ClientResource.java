package com.georgefrick.fun;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;

/**
 * ClientResource a restful CRUD interface. This resource when found by an
 * implementation of JAX-RS (tested with RestEasy); will allow for modification
 * of a non-persistent client database.
 * 
 * @author George Frick (george.frick@gmail.com)
 * 
 */
@Path("/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientResource {

	/**
	 * For the sake of the example; this is our database! Not production
	 * ready...
	 */
	private static Map<Long, Client> clients = new HashMap<Long, Client>();
	private static long key = 1;

	/**
	 * When getting /clients return all the clients.
	 * 
	 * @return all clients.
	 */
	@GET
	public Collection<Client> getClients() {
		return clients.values();
	}

	/**
	 * When calling POST with no id, create a new client.
	 * 
	 * @param entry
	 *            The client, converted from json
	 * @return Client The client, id added.
	 */
	@POST
	public Client createClient(Client client) {
		client.setId(key);
		clients.put(key++, client);
		return client;
	}

	/**
	 * When calling /clients/# return that client.
	 * 
	 * @param id
	 *            Id of client to return.
	 * @return Client The client with corresponding ID. (or a new client)
	 */
	@GET
	@Path("/{id}")
	public Client getClient(@PathParam("id") Long id) {
		return clients.get(id);
	}

	/**
	 * When a put is called on /clients/# then that id number will be 'updated'.
	 * 
	 * @param id
	 *            Which client to update.
	 * @param client
	 *            New client data.
	 * @return Client The same client passed in, in case something "couldn't"
	 *         be updated.
	 */
	@PUT
	@Path("/{id}")
	public Client updateClient(@PathParam("id") Long id, Client client) {
		clients.put(key++, client);
		return client;
	}

	/**
	 * When a delete is called on /clients/# then the client with that id is
	 * discarded.
	 * 
	 * @param id
	 *            Which client to delete.
	 * @return OK status.
	 */
	@DELETE
	@Path("/{id}")
	public String deleteClient(@PathParam("id") Long id) {
		clients.remove(id);
		return "OK";
	}

}
